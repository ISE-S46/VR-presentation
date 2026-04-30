import { useContext } from 'react';
import { CharacterContext } from '../context/characterContext';

const SPEECHES = [
  {
    id: 'intro',
    label: '1. Introduction',
    audioUrl: '/audio/ETC-landing.mp3',
    script: `Hi there, welcome to ETC, or Enabling Technology Collaboratory.
This is where ideas, technology, and innovation come together.
We explore AI, VR, and smart solutions to help improve people’s lives.
Come on, let’s get to know ETC more.`
  },
  // {
  //   id: 'etc',
  //   label: '2. ETC',
  //   audioUrl: '/audio/2_ETC.mp3',
  //   script: `So, what is the Enabling Technology Collaboratory? In simple terms, it's a space where we explore and use new technologies to solve real problems. As we move through twenty twentysix, ETC focuses on three main areas: Immersive Media, the Internet of Things, and Artificial Intelligence. Instead of just learning about these technologies, we use them in practical ways to tackle real-world challenges.`
  // },
  // {
  //   id: 'etc-overview',
  //   label: '3. ETC Overview',
  //   audioUrl: '/audio/3_ETC_Overview.mp3',
  //   script: `The ETC was set up in August twenty twenty by the School of Engineering together with the School of Informatics and IT. It's both a physical space and a shared platform where students, lecturers, and industry partners work together on new ideas and solutions. Besides research, it's also a place for learning, where we run specialised courses to help students and professionals gain useful, future-ready skills.`
  // },
  // {
  //   id: 'internal-partners',
  //   label: '4. Internal Partners',
  //   audioUrl: '/audio/4_Internal_Partners.mp3',
  //   script: `Within Temasek Polytechnic, the ETC supports four main areas: Food Sustainability, Environmental Sustainability, Healthcare & Nutrition, and Intelligent Systems. We use technologies like AI and IoT to support these areas. For example: In food and environment, we're working on a long-endurance drone powered by AI. In healthcare, we're building a system to help assess patients before MRI scans. In intelligent systems, we're developing tools that use AI to identify safety risks from images. These projects show how different fields can come together to solve real problems.`
  // },
  // {
  //   id: 'enternal-partners',
  //   label: '5. External Partners',
  //   audioUrl: '/audio/5_External_Partners.mp3',
  //   script: `To make a real impact, we work closely with industry partners. These include organisations like Tan Tock Seng Hospital, AWS, Certis, and SBS Transit. We collaborate in different ways—such as developing new ideas, testing solutions, and bringing them into real-world use. Partnerships with organisations like Changi General Hospital also help us take our innovations further.`
  // },
  // {
  //   id: 'recent-projects',
  //   label: '6. Recent Projects',
  //   audioUrl: '/audio/6_Recent_Projects.mp3',
  //   script: `Here are some of our recent projects, showing both our research work and industry collaborations. One highlight is our Immersive Role Play Platform, which won the MOE Innergy 2025 Gold Award. We're also exploring virtual environments for training and using VR for areas like medical and workplace safety training. On the industry side, we support companies with AI-based training, safety solutions, and smart health screening tools.`
  // },
  // {
  //   id: 'sample-projects-1',
  //   label: '7. Sample Projects 1',
  //   audioUrl: '/audio/7_Sample_Projects_1.mp3',
  //   script: `Let's take a closer look at one of these projects. This Immersive Role Play Platform allows users to enter realistic virtual environments—like an aviation setting—with digital human characters. It helps people practise communication, decision-making, and procedures in a safe and controlled way, without needing real-world setups.`
  // },
  // {
  //   id: 'sample-projects-2',
  //   label: '8. Sample Projects 2',
  //   audioUrl: '/audio/8_Sample_Projects_2.mp3',
  //   script: `Here are two more examples. The first is MAPS, an app designed to improve patient safety in healthcare settings. The second is an augmented reality app for security training. It adds useful digital information to the real world, helping security staff train in more realistic and interactive scenarios.`
  // },
  // {
  //   id: 'sample-projects-3',
  //   label: '9. Sample Projects 3',
  //   audioUrl: '/audio/9_Sample_Projects_3.mp3',
  //   script: `We also work on a variety of projects across different sectors. For healthcare, we developed a system to help prepare patients before MRI scans. For workplace safety, we use VR to train people in handling dangerous situations safely. And with drones, we combine cameras and thermal sensors with AI to support tasks like environmental monitoring, security, and inspections.`
  // },
  // {
  //   id: 'q&a',
  //   label: '10. Q&A',
  //   audioUrl: '/audio/10_QA.mp3',
  //   script: `That brings us to the end of our overview of the Enabling Technology Collaboratory. We're excited about how we're using technology to solve real problems and prepare our students for the future. Thank you for your time, and we'd be happy to take any questions.`
  // }
];

export default function LocalSpeeches() {
  const ctx = useContext(CharacterContext);

  const handleSpeak = async () => {
    if (!ctx) return;
    // Just trigger the intro for now, or you can link it to the TTS system later
    await ctx.speakLocal(SPEECHES[0].audioUrl, SPEECHES[0].script);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    }}>
      <button
        onClick={handleSpeak}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(5px)',
          transition: 'all 0.3s ease',
          color: 'rgba(255, 255, 255, 0.6)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
        }}
        title="Click to speak"
      >
        {/* Microphone SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="22"></line>
        </svg>
      </button>

      {!ctx && (
        <p style={{ color: 'rgba(255,100,100,0.8)', fontSize: '12px', margin: 0 }}>
          Initializing...
        </p>
      )}
    </div>
  );
}