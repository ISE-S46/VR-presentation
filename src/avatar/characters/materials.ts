import {
  Object3D,
  Mesh,
  Material,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  MeshPhongMaterial,
  DoubleSide
} from 'three';

export function fixMaterial(child: Object3D): void {
  // Type guard to ensure this object actually has material (i.e. Mesh)
  if (!(child instanceof Mesh)) return;

  const fix = (mat: Material): void => {
    // Some materials may not have a name
    const name = (mat.name || '').toLowerCase();

    if (
      (name.includes('hair') || name.includes('eyelash')) &&
      (mat instanceof MeshStandardMaterial ||
        mat instanceof MeshPhysicalMaterial ||
        mat instanceof MeshPhongMaterial)
    ) {
      mat.transparent = false;
      mat.alphaTest = 0.15;
      mat.side = DoubleSide;
      mat.depthWrite = true;
    }

    // --- Optional tweaks
    /*
    if (name.includes('cornea') || name.includes('eyeocclusion') || name.includes('tearline')) {
      if ('transparent' in mat) {
        mat.transparent = true;
        mat.depthWrite = false;
      }
    }
 
    if (name.includes('base_eye') && !name.includes('occlusion')) {
      if ('transparent' in mat) {
        mat.transparent = false;
        mat.depthWrite = true;
      }
    }
 
    if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
      mat.roughness = 0.8;
      mat.metalness = 0.0;
    } else if (mat instanceof THREE.MeshPhongMaterial) {
      mat.shininess = 5;
      mat.specular = new THREE.Color(0x111111);
    }
    */
  };

  if (Array.isArray(child.material)) {
    child.material.forEach(fix);
  } else if (child.material) {
    fix(child.material);
  }
}