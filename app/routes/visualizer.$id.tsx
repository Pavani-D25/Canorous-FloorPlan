import { useNavigate, useOutletContext, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { generate3DView, generateGallery } from "../../lib/ai.action";
import { Box, Download, RefreshCcw, Share2, X, Images } from "lucide-react";
import Button from "../../components/ui/Button";
import { createProject, getProjectById } from "../../lib/puter.action";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

type RenderTab = "topdown" | "isometric";

const VisualizerId = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId } = useOutletContext<AuthContext>();

    const hasInitialGenerated = useRef(false);
    const hasGalleryGenerated = useRef(false);

    const [project, setProject] = useState<DesignItem | null>(null);
    const [isProjectLoading, setIsProjectLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGalleryProcessing, setIsGalleryProcessing] = useState(false);

    const [activeTab, setActiveTab] = useState<RenderTab>("topdown");
    const [topDownImage, setTopDownImage] = useState<string | null>(null);
    const [isometricImage, setIsometricImage] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const currentImage = activeTab === "topdown" ? topDownImage : isometricImage;

    const handleBack = () => navigate('/');

    const handleExport = () => {
        if (!currentImage) return;
        const link = document.createElement('a');
        link.href = currentImage;
        link.download = `canorous-floorplan-${activeTab}-${id || 'design'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);
    const lightboxNext = () => setLightboxIndex(i => (i + 1) % galleryImages.length);
    const lightboxPrev = () => setLightboxIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);

    const runGeneration = async (item: DesignItem) => {
        if (!id || !item.sourceImage) return;

        try {
            setIsProcessing(true);
            const result = await generate3DView({ sourceImage: item.sourceImage });

            if (result.renderedImage) setTopDownImage(result.renderedImage);
            if (result.renderedImageIsometric) setIsometricImage(result.renderedImageIsometric);

            const updatedItem: DesignItem = {
                ...item,
                renderedImage: result.renderedImage ?? item.renderedImage,
                renderedImageIsometric: result.renderedImageIsometric ?? item.renderedImageIsometric,
                renderedPath: result.renderedPath,
                timestamp: Date.now(),
                ownerId: item.ownerId ?? userId ?? null,
                isPublic: item.isPublic ?? false,
            };

            const saved = await createProject({ item: updatedItem, visibility: "private" });

            if (saved) {
                setProject(saved);
                if (saved.renderedImage) setTopDownImage(saved.renderedImage);
                if (saved.renderedImageIsometric) setIsometricImage(saved.renderedImageIsometric);
            }
        } catch (error) {
            console.error('Generation failed: ', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const runGalleryGeneration = async (item: DesignItem) => {
        if (!item.sourceImage || hasGalleryGenerated.current) return;
        hasGalleryGenerated.current = true;

        try {
            setIsGalleryProcessing(true);
            const images = await generateGallery({ sourceImage: item.sourceImage });
            setGalleryImages(images);

            const updatedItem: DesignItem = {
                ...item,
                renderedGallery: images,
                timestamp: Date.now(),
            };

            const saved = await createProject({ item: updatedItem, visibility: "private" });
            if (saved) {
                setProject(saved);
                if (saved.renderedGallery?.length) setGalleryImages(saved.renderedGallery);
            }
        } catch (error) {
            console.error('Gallery generation failed:', error);
        } finally {
            setIsGalleryProcessing(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadProject = async () => {
            if (!id) {
                setIsProjectLoading(false);
                return;
            }

            setIsProjectLoading(true);
            const fetchedProject = await getProjectById({ id });
            if (!isMounted) return;

            setProject(fetchedProject);
            setTopDownImage(fetchedProject?.renderedImage || null);
            setIsometricImage(fetchedProject?.renderedImageIsometric || null);
            if (fetchedProject?.renderedGallery?.length) {
                setGalleryImages(fetchedProject.renderedGallery);
                hasGalleryGenerated.current = true;
            }
            setIsProjectLoading(false);
            hasInitialGenerated.current = false;
        };

        loadProject();
        return () => { isMounted = false; };
    }, [id]);

    // Step 1: generate top-down + isometric
    useEffect(() => {
        if (isProjectLoading || hasInitialGenerated.current || !project?.sourceImage) return;

        if (project.renderedImage) {
            setTopDownImage(project.renderedImage);
            if (project.renderedImageIsometric) setIsometricImage(project.renderedImageIsometric);
            hasInitialGenerated.current = true;
            return;
        }

        hasInitialGenerated.current = true;
        void runGeneration(project);
    }, [project, isProjectLoading]);

    // Step 2: after top-down + isometric done, generate gallery
    useEffect(() => {
        if (isProcessing) return;
        if (!topDownImage) return;
        if (hasGalleryGenerated.current) return;
        if (!project?.sourceImage) return;

        void runGalleryGeneration(project);
    }, [isProcessing, topDownImage, project]);

    const galleryLabels = [
        "Living Room",
        "Kitchen & Dining",
        "Master Bedroom",
        "Hallway & Entrance",
        "Secondary Room",
    ];

    return (
        <div className="visualizer">
            <nav className="topbar">
                <div className="brand">
                    <Box className="logo" />
                    <span className="name">Canorous-FloorPlan</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
                    <X className="icon" /> Exit Editor
                </Button>
            </nav>

            <section className="content">
                {/* Main panel with tab toggle */}
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-meta">
                            <p>Project</p>
                            <h2>{project?.name || `Residence ${id}`}</h2>
                            <p className="note">Created by You</p>
                        </div>
                        <div className="panel-actions">
                            <Button
                                size="sm"
                                onClick={handleExport}
                                className="export"
                                disabled={!currentImage}
                            >
                                <Download className="w-4 h-4 mr-2" /> Export
                            </Button>
                            <Button size="sm" onClick={() => {}} className="share">
                                <Share2 className="w-4 h-4 mr-2" /> Share
                            </Button>
                        </div>
                    </div>

                    {/* Tab toggle */}
                    <div className="render-tabs">
                        <button
                            className={`render-tab ${activeTab === 'topdown' ? 'active' : ''}`}
                            onClick={() => setActiveTab('topdown')}
                        >
                            Top-Down
                        </button>
                        <button
                            className={`render-tab ${activeTab === 'isometric' ? 'active' : ''}`}
                            onClick={() => setActiveTab('isometric')}
                        >
                            Isometric 3D
                        </button>
                    </div>

                    <div className={`render-area ${isProcessing ? 'is-processing' : ''}`}>
                        {currentImage ? (
                            <img src={currentImage} alt="AI Render" className="render-img" />
                        ) : (
                            <div className="render-placeholder">
                                {project?.sourceImage && (
                                    <img src={project.sourceImage} alt="Original" className="render-fallback" />
                                )}
                            </div>
                        )}

                        {isProcessing && (
                            <div className="render-overlay">
                                <div className="rendering-card">
                                    <RefreshCcw className="spinner" />
                                    <span className="title">Rendering...</span>
                                    <span className="subtitle">Generating top-down and isometric views</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Compare panel — original floor plan vs top-down render */}
                <div className="panel compare">
                    <div className="panel-header">
                        <div className="panel-meta">
                            <p>Comparison</p>
                            <h3>Before and After</h3>
                        </div>
                        <div className="hint">Drag to compare</div>
                    </div>

                    <div className="compare-stage">
                        {project?.sourceImage && topDownImage ? (
                            <ReactCompareSlider
                                defaultValue={50}
                                style={{ width: '100%', height: 'auto' }}
                                itemOne={
                                    <ReactCompareSliderImage
                                        src={project.sourceImage}
                                        alt="Original Floor Plan"
                                        className="compare-img"
                                    />
                                }
                                itemTwo={
                                    <ReactCompareSliderImage
                                        src={topDownImage}
                                        alt="3D Render"
                                        className="compare-img"
                                    />
                                }
                            />
                        ) : project?.sourceImage ? (
                            <div className="compare-fallback">
                                <img
                                    src={project.sourceImage}
                                    alt="Original Floor Plan"
                                    className="compare-img"
                                />
                                {isProcessing && (
                                    <p className="compare-waiting">Render generating...</p>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>

            {/* Interior Gallery — full width below main content */}
            <section className="gallery-section">
                <div className="gallery-header">
                    <div className="gallery-meta">
                        <Images className="gallery-icon" />
                        <div>
                            <h3>Interior Views</h3>
                            <p>AI-generated room perspectives</p>
                        </div>
                    </div>
                    {isGalleryProcessing && (
                        <div className="gallery-processing">
                            <RefreshCcw className="spinner" />
                            <span>Generating interiors...</span>
                        </div>
                    )}
                </div>

                {isGalleryProcessing && galleryImages.length === 0 ? (
                    <div className="gallery-skeleton">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="gallery-skeleton-item">
                                <div className="skeleton-shimmer" />
                            </div>
                        ))}
                    </div>
                ) : galleryImages.length > 0 ? (
                    <div className="gallery-grid">
                        {galleryImages.map((img, i) => (
                            <div
                                key={i}
                                className="gallery-item"
                                onClick={() => openLightbox(i)}
                            >
                                <img
                                    src={img}
                                    alt={galleryLabels[i] || `Interior ${i + 1}`}
                                    className="gallery-img"
                                />
                                <div className="gallery-item-label">
                                    <span>{galleryLabels[i] || `Interior ${i + 1}`}</span>
                                </div>
                            </div>
                        ))}
                        {isGalleryProcessing && (
                            <div className="gallery-item gallery-item-loading">
                                <RefreshCcw className="spinner" />
                                <span>Rendering...</span>
                            </div>
                        )}
                    </div>
                ) : !isGalleryProcessing && !isProcessing && project?.sourceImage ? (
                    <div className="gallery-empty">
                        <p>Interior views will generate after the main renders complete.</p>
                    </div>
                ) : null}
            </section>

            {/* Lightbox */}
            {lightboxOpen && galleryImages.length > 0 && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={closeLightbox}>
                            <X />
                        </button>
                        <button className="lightbox-prev" onClick={lightboxPrev}>&#8592;</button>
                        <img
                            src={galleryImages[lightboxIndex]}
                            alt={galleryLabels[lightboxIndex] || `Interior ${lightboxIndex + 1}`}
                            className="lightbox-img"
                        />
                        <button className="lightbox-next" onClick={lightboxNext}>&#8594;</button>
                        <div className="lightbox-label">
                            {galleryLabels[lightboxIndex] || `Interior ${lightboxIndex + 1}`}
                            <span className="lightbox-counter"> ({lightboxIndex + 1} / {galleryImages.length})</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisualizerId;