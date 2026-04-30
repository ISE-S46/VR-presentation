import { useContext } from 'react';
import { CharacterContext } from '../context/characterContext';
import '../styles/speechControls.css';

const SPEECHES = [
  {
    id: 'intro',
    label: '1. Introduction',
    audioUrl: '/audio/1_Introduction.mp3',
    script: `Welcome everyone, and thank you for being here today. As shown on the screen, the School of Engineering at Temasek Polytechnic offers a wide range of diploma programmes—from Aerospace and Biomedical Engineering to Computer Engineering and Mechatronics. Our goal is to help students grow into passionate learners who continue improving throughout their lives. We're proud that more than 60% of our graduates go on to university. In recent years, many of our students have also received scholarships from universities, government agencies, and industry partners. Today, we'd like to introduce one of the key reasons behind this success—the Enabling Technology Collaboratory, or ETC.`
  },
  {
    id: 'etc',
    label: '2. ETC',
    audioUrl: '/audio/2_ETC.mp3',
    script: `So, what is the Enabling Technology Collaboratory? In simple terms, it's a space where we explore and use new technologies to solve real problems. As we move through twenty twentysix, ETC focuses on three main areas: Immersive Media, the Internet of Things, and Artificial Intelligence. Instead of just learning about these technologies, we use them in practical ways to tackle real-world challenges.`
  },
  {
    id: 'etc-overview',
    label: '3. ETC Overview',
    audioUrl: '/audio/3_ETC_Overview.mp3',
    script: `The ETC was set up in August twenty twenty by the School of Engineering together with the School of Informatics and IT. It's both a physical space and a shared platform where students, lecturers, and industry partners work together on new ideas and solutions. Besides research, it's also a place for learning, where we run specialised courses to help students and professionals gain useful, future-ready skills.`
  },
  {
    id: 'internal-partners',
    label: '4. Internal Partners',
    audioUrl: '/audio/4_Internal_Partners.mp3',
    script: `Within Temasek Polytechnic, the ETC supports four main areas: Food Sustainability, Environmental Sustainability, Healthcare & Nutrition, and Intelligent Systems. We use technologies like AI and IoT to support these areas. For example: In food and environment, we're working on a long-endurance drone powered by AI. In healthcare, we're building a system to help assess patients before MRI scans. In intelligent systems, we're developing tools that use AI to identify safety risks from images. These projects show how different fields can come together to solve real problems.`
  },
  {
    id: 'enternal-partners',
    label: '5. External Partners',
    audioUrl: '/audio/5_External_Partners.mp3',
    script: `To make a real impact, we work closely with industry partners. These include organisations like Tan Tock Seng Hospital, AWS, Certis, and SBS Transit. We collaborate in different ways—such as developing new ideas, testing solutions, and bringing them into real-world use. Partnerships with organisations like Changi General Hospital also help us take our innovations further.`
  },
  {
    id: 'recent-projects',
    label: '6. Recent Projects',
    audioUrl: '/audio/6_Recent_Projects.mp3',
    script: `Here are some of our recent projects, showing both our research work and industry collaborations. One highlight is our Immersive Role Play Platform, which won the MOE Innergy 2025 Gold Award. We're also exploring virtual environments for training and using VR for areas like medical and workplace safety training. On the industry side, we support companies with AI-based training, safety solutions, and smart health screening tools.`
  },
  {
    id: 'sample-projects-1',
    label: '7. Sample Projects 1',
    audioUrl: '/audio/7_Sample_Projects_1.mp3',
    script: `Let's take a closer look at one of these projects. This Immersive Role Play Platform allows users to enter realistic virtual environments—like an aviation setting—with digital human characters. It helps people practise communication, decision-making, and procedures in a safe and controlled way, without needing real-world setups.`
  },
  {
    id: 'sample-projects-2',
    label: '8. Sample Projects 2',
    audioUrl: '/audio/8_Sample_Projects_2.mp3',
    script: `Here are two more examples. The first is MAPS, an app designed to improve patient safety in healthcare settings. The second is an augmented reality app for security training. It adds useful digital information to the real world, helping security staff train in more realistic and interactive scenarios.`
  },
  {
    id: 'sample-projects-3',
    label: '9. Sample Projects 3',
    audioUrl: '/audio/9_Sample_Projects_3.mp3',
    script: `We also work on a variety of projects across different sectors. For healthcare, we developed a system to help prepare patients before MRI scans. For workplace safety, we use VR to train people in handling dangerous situations safely. And with drones, we combine cameras and thermal sensors with AI to support tasks like environmental monitoring, security, and inspections.`
  },
  {
    id: 'q&a',
    label: '10. Q&A',
    audioUrl: '/audio/10_QA.mp3',
    script: `That brings us to the end of our overview of the Enabling Technology Collaboratory. We're excited about how we're using technology to solve real problems and prepare our students for the future. Thank you for your time, and we'd be happy to take any questions.`
  }
];

export default function LocalSpeeches() {
  const ctx = useContext(CharacterContext);

  const handleSpeak = async (audioUrl: string, script: string) => {
    if (!ctx) return;
    await ctx.speakLocal(audioUrl, script);
  };

  return (
    <div className="uiContainer">
      <div className="buttonGroup">
        {SPEECHES.map((speech) => (
          <button
            key={speech.id}
            className="playBtn"
            id={`playbtn-${speech.id}`}
            onClick={() => handleSpeak(speech.audioUrl, speech.script)}
          >
            {speech.label}
          </button>
        ))}
      </div>

      {!ctx && (
        <p className="statusText statusError">
          Waiting for initialization...
        </p>
      )}
    </div>
  );
}