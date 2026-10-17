import { AssetLoader, MineRenderWorld, NBTHelper, Renderer, SceneDocumentLoader, StructureParser } from "minerender/browser";
import type { LoadedSceneObject, SceneObjectDefinition } from "minerender/browser";
import { Buffer } from "buffer";
import { Box3, Vector3 } from "three";
import type { Mesh, PerspectiveCamera } from "three";

// prismarine-nbt reads Buffer as a global; nuxt.config.ts keeps that polyfill out of the entry chunk.
(globalThis as { Buffer?: typeof Buffer }).Buffer ??= Buffer;

export type MineRenderViewer = {
    show: (definition: SceneObjectDefinition) => Promise<void>,
    showStructure: (data: Blob) => Promise<void>,
    dispose: () => void,
};

export const createMineRenderViewer = (container: HTMLElement, version: string): MineRenderViewer => {
    AssetLoader.setVersion(version);
    const renderer = new Renderer({
        render: { pixelRatio: 1, antialias: true, autoResize: false, stats: false, fpsLimit: 60 },
        composer: { enabled: false },
        controls: { enabled: true, mode: "orbit" },
        camera: { position: [40, 30, 50], near: 0.1, far: 10000 },
        debug: { grid: false, axes: false }
    });
    renderer.stop();
    renderer.appendTo(container);
    const observer = new ResizeObserver(entries => {
        for (const {contentRect: {width, height}} of entries) {
            if (width && height) renderer.resize(width, height);
        }
    });
    observer.observe(container);
    let loaded: LoadedSceneObject | undefined;
    let world: MineRenderWorld | undefined;
    let request = 0;
    let disposed = false;

    const frame = (bounds: Box3) => {
        const center = bounds.isEmpty() ? new Vector3() : bounds.getCenter(new Vector3());
        const radius = bounds.isEmpty() ? 16 : Math.max(1, bounds.getSize(new Vector3()).length() / 2);
        const camera = renderer.camera as PerspectiveCamera;
        const direction = camera.position.clone().sub(renderer.orbitControls?.target ?? new Vector3());
        if (direction.lengthSq() < 0.01) direction.set(1, 0.75, 1);
        const vertical = camera.fov * Math.PI / 360;
        const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
        const distance = radius / Math.sin(Math.min(vertical, horizontal)) * 1.15;
        camera.position.copy(center).addScaledVector(direction.normalize(), distance);
        camera.near = Math.max(0.01, Math.min(1, distance / 1000));
        camera.far = Math.max(10000, distance + radius * 4);
        camera.lookAt(center);
        camera.updateProjectionMatrix();
        renderer.orbitControls?.target.copy(center);
        renderer.orbitControls?.update();
        renderer.dirty = true;
        renderer.renderOnce();
        renderer.start();
    };

    return {
        async show(definition) {
            const current = ++request;
            let next: LoadedSceneObject;
            try {
                next = await SceneDocumentLoader.loadObject(renderer.scene, definition);
                if (disposed || current !== request) {
                    next.dispose();
                    return;
                }
                await world?.clear();
            } catch (error) {
                if (disposed || current !== request) return;
                throw error;
            }
            if (disposed || current !== request) {
                next.dispose();
                return;
            }
            loaded?.dispose();
            loaded = next;
            loaded.root.updateWorldMatrix(true, true);
            const bounds = new Box3();
            loaded.root.traverseVisible(object => {
                if (!(object as Mesh).isMesh) return;
                const mesh = object as Mesh;
                mesh.geometry.computeBoundingBox();
                if (mesh.geometry.boundingBox) bounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
            });
            frame(bounds);
        },
        async showStructure(data) {
            const current = ++request;
            try {
                const buffer = await data.arrayBuffer();
                if (disposed || current !== request) return;
                const nbt = await NBTHelper.fromBuffer(buffer);
                if (disposed || current !== request) return;
                const structure = await StructureParser.parse(nbt);
                if (disposed || current !== request) return;
                loaded?.dispose();
                loaded = undefined;
                world ??= new MineRenderWorld(renderer.scene, { sectionMeshing: true });
                await world.clear();
                if (disposed || current !== request) return;
                const [sx, sy, sz] = structure.size;
                frame(new Box3(new Vector3(-8, -8, -8), new Vector3(sx * 16 - 8, sy * 16 - 8, sz * 16 - 8)));
                await world.placeMultiBlock(structure);
                if (disposed || current !== request) return;
                renderer.dirty = true;
            } catch (error) {
                if (disposed || current !== request) return;
                throw error;
            }
        },
        dispose() {
            if (disposed) return;
            disposed = true;
            observer.disconnect();
            loaded?.dispose();
            world?.clear().catch(() => undefined);
            renderer.dispose();
        }
    };
};
