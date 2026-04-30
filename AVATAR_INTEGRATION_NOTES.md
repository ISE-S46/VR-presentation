# Avatar System Integration Notes

บันทึกการทำงานของการนำระบบ 3D Avatar (จากโฟลเดอร์ `threejs-test` ของเพื่อน) เข้ามารวมกับโปรเจกต์ `etc-app` 

## 1. การย้ายโค้ดเข้าสู่โปรเจกต์ (Migration)
- **สร้างโฟลเดอร์ `src/avatar/`**: ย้ายโค้ดทั้งหมดจาก `threejs-test/src/` เข้ามาไว้ในนี้ เพื่อแยกส่วนการทำงานของ Avatar ออกจาก UI หลักของเว็บ
- **ย้ายไฟล์ Assets**: คัดลอกโฟลเดอร์ `threejs-test/public/` เข้ามาที่ `etc-app/public/` (รวมถึงไฟล์ 3D โมเดล เช่น `LowRes.glb` และโฟลเดอร์เสียงต่างๆ)
- **ย้ายไฟล์ Library**: คัดลอกโฟลเดอร์ `library/` (ที่บรรจุระบบ LipSync) เข้ามาไว้ที่ `etc-app/src/library/` เพื่อป้องกัน error พาธหาไฟล์ไม่เจอ

## 2. การปรับแก้ระบบของเพื่อน (Refactoring)
- **ปรับแก้ `useCharacter.ts` และ `useCharacterLoader.ts`**: คืนค่าการรับพารามิเตอร์ `modelUrl` กลับมา (จากเดิมที่เพื่อน hardcode ล็อกชื่อไฟล์ไว้) เพื่อให้ระบบรองรับการแสดงผลโมเดลที่แตกต่างกันในแต่ละหน้าได้
- **ปรับแก้ `App.tsx` (ในโฟลเดอร์ avatar)**: เปลี่ยนให้ Component รับ props `{ modelUrl }` แล้วส่งต่อไปให้ระบบโหลดโมเดล
- **ปรับแต่ง `CharacterViewer.jsx`**: ลบโค้ดหุ่นยนต์จำลองออก แล้วครอบด้วย `<Suspense>` เพื่อเรียกใช้งาน `AvatarApp` (ระบบของเพื่อน) โดยตรง 

## 3. การปรับแต่ง UI และการแสดงผล (Styling & Visuals)
- **ลบพื้นหลังดำ (Transparent Background)**:
  - แก้ไขไฟล์ `src/avatar/styles/styles.css` โดยลบ `background-color: #121212;` ที่ผูกกับ `body` ออก เพื่อไม่ให้ทับกับพื้นหลังของหน้าเว็บ
  - แก้ไขไฟล์ `src/avatar/core/renderer.ts` โดยตั้งค่า `alpha: true` ให้กับ `WebGLRenderer` เพื่อให้พื้นที่ 3D มีความโปร่งใส (เหมือนไฟล์ PNG)
- **จัดให้ขนาดพอดีกรอบ (Container Fitting)**:
  - แก้ไข `styles.css` เปลี่ยน `position: fixed;` และ `100vw`/`100vh` เป็น `position: absolute;` และ `width: 100%; height: 100%;` เพื่อให้โมเดล 3D ไม่บังเต็มจอ แต่จะถูกกักบริเวณอยู่ใน `<div>` ที่กำหนด
  - แก้ไขระบบ Resize ใน `renderer.ts` ให้คำนวณขนาดจาก `parentElement` แทนที่จะดึงค่ากว้าง/ยาวจาก `window`
- **การจัดวางในหน้าเว็บ**:
  - ถอด `CharacterViewer` ออกจากหน้า **Interactive Q&A** (`QnA.jsx`) ให้กลับไปใช้ `VRPlaceholder` ปกติ
  - คง `CharacterViewer` ไว้ที่ **Landing Page** ให้อยู่ตรงกลางหน้า (ตามความต้องการล่าสุด)
- **ปุ่มไมโครโฟน (Minimal UI)**:
  - แก้ไข `src/avatar/components/localSpeeches.tsx` 
  - ลบปุ่มรายการเสียง (1. Introduction, 2. ETC, ...) ออกทั้งหมด
  - แทนที่ด้วยปุ่มรูป **ไมโครโฟนโปร่งแสง (Glassmorphism)** วางไว้ตรงกลางด้านล่างของตัวละคร 
  - ผูกสคริปต์ให้เมื่อผู้ใช้กดปุ่ม ตัวละครจะพูดบท "1. Introduction" ทันที

## วิธีนำไปใช้งานต่อ
เมื่อเพื่อนทำโมเดลตัวอื่นๆ เสร็จ สามารถนำไฟล์ `.glb` มาใส่ในโฟลเดอร์ `public/` แล้วแก้ชื่อไฟล์ในโค้ดได้เลย:
\`\`\`jsx
<CharacterViewer modelPath="/ชื่อไฟล์ของเพื่อน.glb" />
\`\`\`
