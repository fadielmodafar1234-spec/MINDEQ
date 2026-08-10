import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Scene,
} from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

class NodeFileReader {
  result = null;
  onloadend = null;

  readAsArrayBuffer(blob) {
    void blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }

  readAsDataURL(blob) {
    void blob.arrayBuffer().then((result) => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString("base64")}`;
      this.onloadend?.();
    });
  }
}

globalThis.FileReader = NodeFileReader;

const scene = new Scene();
scene.name = "development-machine-scene";

const machine = new Group();
machine.name = "development-machine-root";
scene.add(machine);

const darkMetal = new MeshStandardMaterial({
  color: 0x2f3734,
  metalness: 0.65,
  roughness: 0.45,
});
const paintedMetal = new MeshStandardMaterial({
  color: 0x315966,
  metalness: 0.5,
  roughness: 0.38,
});
const accentMetal = new MeshStandardMaterial({
  color: 0x9a5228,
  metalness: 0.45,
  roughness: 0.4,
});

function addBox(name, size, position, material) {
  const mesh = new Mesh(new BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  machine.add(mesh);
  return mesh;
}

addBox("base", [2.4, 0.35, 1.45], [0, 0.175, 0], darkMetal);
addBox("tower", [0.55, 1.5, 0.8], [-0.65, 1.05, -0.1], paintedMetal);
addBox(
  "inspection-head",
  [1.15, 0.42, 0.75],
  [0.25, 1.55, 0.08],
  accentMetal,
);
addBox("side-guard", [0.12, 0.95, 1.2], [1.02, 0.85, 0], paintedMetal);

const drive = new Mesh(
  new CylinderGeometry(0.28, 0.28, 0.55, 24),
  darkMetal,
);
drive.name = "drive-placeholder";
drive.rotation.z = Math.PI / 2;
drive.position.set(0.52, 0.62, -0.28);
drive.castShadow = true;
machine.add(drive);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, {
  binary: true,
  onlyVisible: true,
});
const outputDirectory = join(process.cwd(), ".mindeq-development-assets");
const modelOutputPath = join(
  outputDirectory,
  "development-machine.viewer.glb",
);
const documentationOutputPath = join(
  outputDirectory,
  "development-machine.documentation.txt",
);
const developmentDocumentation =
  "DEVELOPMENT PLACEHOLDER \u2014 NOT VERIFIED\n\n" +
  "Synthetic text fixture used only to test the guarded development download.\n";

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(modelOutputPath, Buffer.from(glb)),
  writeFile(documentationOutputPath, developmentDocumentation, "utf8"),
]);

console.log(`Generated ${modelOutputPath} (${glb.byteLength} bytes).`);
console.log(`Generated ${documentationOutputPath}.`);
