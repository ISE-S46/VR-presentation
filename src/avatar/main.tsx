import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AvatarApp from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AvatarApp
      modelUrl='/models/FModel1.glb'
      audioUrl="/audio/1_Introduction.mp3"
      script="Welcome everyone, and thank you for being here today. As shown on the screen, the School of Engineering at Temasek Polytechnic offers a wide range of diploma programmes—from Aerospace and Biomedical Engineering to Computer Engineering and Mechatronics. Our goal is to help students grow into passionate learners who continue improving throughout their lives. We're proud that more than 60% of our graduates go on to university. In recent years, many of our students have also received scholarships from universities, government agencies, and industry partners. Today, we'd like to introduce one of the key reasons behind this success—the Enabling Technology Collaboratory, or ETC."
    />
  </StrictMode>,
)
