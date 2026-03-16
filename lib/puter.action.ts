// // import puter from "@heyputer/puter.js";
// // import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
// // import { isHostedUrl } from "./utils";
// // import { PUTER_WORKER_URL } from "./constants";
// //
// // export const signIn = async () => await puter.auth.signIn();
// //
// // export const signOut = () => puter.auth.signOut();
// //
// // export const getCurrentUser = async () => {
// //     try {
// //         return await puter.auth.getUser();
// //     } catch {
// //         return null;
// //     }
// // };
// //
// // export const createProject = async ({ item, visibility = "private" }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
// //     if (!PUTER_WORKER_URL) {
// //         console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
// //         return null;
// //     }
// //
// //     const projectId = item.id;
// //     const hosting = await getOrCreateHostingConfig();
// //
// //     const hostedSource = projectId
// //         ? await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: 'source' })
// //         : null;
// //
// //     const hostedRender = projectId && item.renderedImage
// //         ? await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: 'rendered' })
// //         : null;
// //
// //     const hostedIsometric = projectId && item.renderedImageIsometric
// //         ? await uploadImageToHosting({ hosting, url: item.renderedImageIsometric, projectId, label: 'isometric' })
// //         : null;
// //
// //     // Upload gallery images one by one
// //     const hostedGallery: string[] = [];
// //     if (projectId && item.renderedGallery?.length) {
// //         for (let i = 0; i < item.renderedGallery.length; i++) {
// //             const img = item.renderedGallery[i];
// //             if (img) {
// //                 const hosted = await uploadImageToHosting({
// //                     hosting,
// //                     url: img,
// //                     projectId,
// //                     label: 'gallery',
// //                 });
// //                 const resolved = hosted?.url || (isHostedUrl(img) ? img : '');
// //                 if (resolved) hostedGallery.push(resolved);
// //             }
// //         }
// //     }
// //
// //     const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage : '');
// //
// //     if (!resolvedSource) {
// //         console.warn('Failed to host source image, skipping save.');
// //         return null;
// //     }
// //
// //     const resolvedRender = hostedRender?.url
// //         ? hostedRender.url
// //         : item.renderedImage && isHostedUrl(item.renderedImage)
// //             ? item.renderedImage
// //             : undefined;
// //
// //     const resolvedIsometric = hostedIsometric?.url
// //         ? hostedIsometric.url
// //         : item.renderedImageIsometric && isHostedUrl(item.renderedImageIsometric)
// //             ? item.renderedImageIsometric
// //             : undefined;
// //
// //     const resolvedGallery = hostedGallery.length > 0
// //         ? hostedGallery
// //         : item.renderedGallery?.filter(img => isHostedUrl(img)) ?? undefined;
// //
// //     const {
// //         sourcePath: _sourcePath,
// //         renderedPath: _renderedPath,
// //         publicPath: _publicPath,
// //         ...rest
// //     } = item;
// //
// //     const payload = {
// //         ...rest,
// //         sourceImage: resolvedSource,
// //         renderedImage: resolvedRender,
// //         renderedImageIsometric: resolvedIsometric,
// //         renderedGallery: resolvedGallery,
// //     };
// //
// //     try {
// //         const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
// //             method: 'POST',
// //             body: JSON.stringify({ project: payload, visibility }),
// //         });
// //
// //         if (!response.ok) {
// //             console.error('Failed to save the project', await response.text());
// //             return null;
// //         }
// //
// //         const data = (await response.json()) as { project?: DesignItem | null };
// //         return data?.project ?? null;
// //     } catch (e) {
// //         console.error('Failed to save project', e);
// //         return null;
// //     }
// // };
// //
// // export const getProjects = async () => {
// //     if (!PUTER_WORKER_URL) {
// //         console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
// //         return [];
// //     }
// //
// //     try {
// //         const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, { method: 'GET' });
// //
// //         if (!response.ok) {
// //             console.error('Failed to fetch history', await response.text());
// //             return [];
// //         }
// //
// //         const data = (await response.json()) as { projects?: DesignItem[] | null };
// //         return Array.isArray(data?.projects) ? data.projects : [];
// //     } catch (e) {
// //         console.error('Failed to get projects', e);
// //         return [];
// //     }
// // };
// //
// // export const getProjectById = async ({ id }: { id: string }) => {
// //     if (!PUTER_WORKER_URL) {
// //         console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
// //         return null;
// //     }
// //
// //     try {
// //         const response = await puter.workers.exec(
// //             `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
// //             { method: "GET" },
// //         );
// //
// //         if (!response.ok) {
// //             console.error("Failed to fetch project:", await response.text());
// //             return null;
// //         }
// //
// //         const data = (await response.json()) as { project?: DesignItem | null };
// //         return data?.project ?? null;
// //     } catch (error) {
// //         console.error("Failed to fetch project:", error);
// //         return null;
// //     }
// // };
//
//
// import puter from "@heyputer/puter.js";
// import {
//     CANOROUS_PROMPT_TOPDOWN,
//     CANOROUS_PROMPT_ISOMETRIC,
//     CANOROUS_GALLERY_PROMPTS,
// } from "./constants";
//
// export const fetchAsDataUrl = async (url: string): Promise<string> => {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch image: ${response.statusText}`);
//     }
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result as string);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//     });
// };
//
// const generateSingleView = async (
//     prompt: string,
//     base64Data: string,
//     mimeType: string
// ): Promise<string | null> => {
//     try {
//         const response = await puter.ai.txt2img(prompt, {
//             provider: "gemini",
//             model: "gemini-2.5-flash-image-preview",
//             input_image: base64Data,
//             input_image_mime_type: mimeType,
//             ratio: { w: 1024, h: 1024 },
//         });
//
//         const rawUrl = (response as HTMLImageElement).src ?? null;
//         if (!rawUrl) return null;
//
//         return rawUrl.startsWith('data:') ? rawUrl : await fetchAsDataUrl(rawUrl);
//     } catch (error) {
//         console.error('generateSingleView failed:', error);
//         return null;
//     }
// };
//
// // Step 1 — top-down + isometric in parallel
// export const generate3DView = async ({ sourceImage }: Generate3DViewParams) => {
//     const dataUrl = sourceImage.startsWith('data:')
//         ? sourceImage
//         : await fetchAsDataUrl(sourceImage);
//
//     const base64Data = dataUrl.split(',')[1];
//     const mimeType = dataUrl.split(';')[0].split(':')[1];
//
//     if (!mimeType || !base64Data) throw new Error('Invalid source image payload');
//
//     const [renderedImage, renderedImageIsometric] = await Promise.all([
//         generateSingleView(CANOROUS_PROMPT_TOPDOWN, base64Data, mimeType),
//         generateSingleView(CANOROUS_PROMPT_ISOMETRIC, base64Data, mimeType),
//     ]);
//
//     return {
//         renderedImage,
//         renderedImageIsometric,
//         renderedPath: undefined,
//     };
// };
//
// // Step 2 — gallery interior shots, user-controlled count.
// // FIX: each index in CANOROUS_GALLERY_PROMPTS must be a DISTINCT room-specific
// // prompt (e.g. index 0 = living room, index 1 = kitchen, etc.).
// // If all prompts are identical, the AI will return identical images.
// export const generateGallery = async ({
//                                           sourceImage,
//                                           count = 5,
//                                       }: Generate3DViewParams & { count?: number }): Promise<string[]> => {
//     const dataUrl = sourceImage.startsWith('data:')
//         ? sourceImage
//         : await fetchAsDataUrl(sourceImage);
//
//     const base64Data = dataUrl.split(',')[1];
//     const mimeType = dataUrl.split(';')[0].split(':')[1];
//
//     if (!mimeType || !base64Data) throw new Error('Invalid source image payload');
//
//     // Slice to the requested count so user only pays for what they asked for
//     const selectedPrompts = CANOROUS_GALLERY_PROMPTS.slice(0, count);
//
//     const results = await Promise.all(
//         selectedPrompts.map(prompt =>
//             generateSingleView(prompt, base64Data, mimeType)
//         )
//     );
//
//     return results.filter((img): img is string => img !== null);
// };


import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";
import { PUTER_WORKER_URL } from "./constants";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch {
        return null;
    }
};

export const createProject = async ({ item, visibility = "private" }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    if (!PUTER_WORKER_URL) {
        console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
        return null;
    }

    const projectId = item.id;
    const hosting = await getOrCreateHostingConfig();

    const hostedSource = projectId
        ? await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: 'source' })
        : null;

    const hostedRender = projectId && item.renderedImage
        ? await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: 'rendered' })
        : null;

    const hostedIsometric = projectId && item.renderedImageIsometric
        ? await uploadImageToHosting({ hosting, url: item.renderedImageIsometric, projectId, label: 'isometric' })
        : null;

    // Upload gallery images one by one
    const hostedGallery: string[] = [];
    if (projectId && item.renderedGallery?.length) {
        for (let i = 0; i < item.renderedGallery.length; i++) {
            const img = item.renderedGallery[i];
            if (img) {
                const hosted = await uploadImageToHosting({
                    hosting,
                    url: img,
                    projectId,
                    label: 'gallery',
                });
                const resolved = hosted?.url || (isHostedUrl(img) ? img : '');
                if (resolved) hostedGallery.push(resolved);
            }
        }
    }

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage : '');

    if (!resolvedSource) {
        console.warn('Failed to host source image, skipping save.');
        return null;
    }

    const resolvedRender = hostedRender?.url
        ? hostedRender.url
        : item.renderedImage && isHostedUrl(item.renderedImage)
            ? item.renderedImage
            : undefined;

    const resolvedIsometric = hostedIsometric?.url
        ? hostedIsometric.url
        : item.renderedImageIsometric && isHostedUrl(item.renderedImageIsometric)
            ? item.renderedImageIsometric
            : undefined;

    const resolvedGallery = hostedGallery.length > 0
        ? hostedGallery
        : item.renderedGallery?.filter(img => isHostedUrl(img)) ?? undefined;

    const {
        sourcePath: _sourcePath,
        renderedPath: _renderedPath,
        publicPath: _publicPath,
        ...rest
    } = item;

    const payload = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolvedRender,
        renderedImageIsometric: resolvedIsometric,
        renderedGallery: resolvedGallery,
    };

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
            method: 'POST',
            body: JSON.stringify({ project: payload, visibility }),
        });

        if (!response.ok) {
            console.error('Failed to save the project', await response.text());
            return null;
        }

        const data = (await response.json()) as { project?: DesignItem | null };
        return data?.project ?? null;
    } catch (e) {
        console.error('Failed to save project', e);
        return null;
    }
};

export const getProjects = async () => {
    if (!PUTER_WORKER_URL) {
        console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
        return [];
    }

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, { method: 'GET' });

        if (!response.ok) {
            console.error('Failed to fetch history', await response.text());
            return [];
        }

        const data = (await response.json()) as { projects?: DesignItem[] | null };
        return Array.isArray(data?.projects) ? data.projects : [];
    } catch (e) {
        console.error('Failed to get projects', e);
        return [];
    }
};

export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
        return null;
    }

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        if (!response.ok) {
            console.error("Failed to fetch project:", await response.text());
            return null;
        }

        const data = (await response.json()) as { project?: DesignItem | null };
        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};