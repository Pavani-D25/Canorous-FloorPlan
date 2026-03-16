import puter from "@heyputer/puter.js";
import {
    CANOROUS_PROMPT_TOPDOWN,
    CANOROUS_PROMPT_ISOMETRIC,
    CANOROUS_GALLERY_PROMPTS,
} from "./constants";

export const fetchAsDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const generateSingleView = async (
    prompt: string,
    base64Data: string,
    mimeType: string
): Promise<string | null> => {
    try {
        const response = await puter.ai.txt2img(prompt, {
            provider: "gemini",
            model: "gemini-2.5-flash-image-preview",
            input_image: base64Data,
            input_image_mime_type: mimeType,
            ratio: { w: 1024, h: 1024 },
        });

        const rawUrl = (response as HTMLImageElement).src ?? null;
        if (!rawUrl) return null;

        return rawUrl.startsWith('data:') ? rawUrl : await fetchAsDataUrl(rawUrl);
    } catch (error) {
        console.error('generateSingleView failed:', error);
        return null;
    }
};

// Step 1 — top-down + isometric in parallel
export const generate3DView = async ({ sourceImage }: Generate3DViewParams) => {
    const dataUrl = sourceImage.startsWith('data:')
        ? sourceImage
        : await fetchAsDataUrl(sourceImage);

    const base64Data = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];

    if (!mimeType || !base64Data) throw new Error('Invalid source image payload');

    const [renderedImage, renderedImageIsometric] = await Promise.all([
        generateSingleView(CANOROUS_PROMPT_TOPDOWN, base64Data, mimeType),
        generateSingleView(CANOROUS_PROMPT_ISOMETRIC, base64Data, mimeType),
    ]);

    return {
        renderedImage,
        renderedImageIsometric,
        renderedPath: undefined,
    };
};

// Step 2 — 5 gallery interior shots in parallel, called after step 1 completes
export const generateGallery = async ({ sourceImage }: Generate3DViewParams): Promise<string[]> => {
    const dataUrl = sourceImage.startsWith('data:')
        ? sourceImage
        : await fetchAsDataUrl(sourceImage);

    const base64Data = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];

    if (!mimeType || !base64Data) throw new Error('Invalid source image payload');

    const results = await Promise.all(
        CANOROUS_GALLERY_PROMPTS.map(prompt =>
            generateSingleView(prompt, base64Data, mimeType)
        )
    );

    return results.filter((img): img is string => img !== null);
};