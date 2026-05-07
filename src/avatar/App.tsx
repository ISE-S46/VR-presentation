import SceneCanvas from './components/sceneCanvas';
// import SpeechControls from './components/speechControls';
// import LocalSpeeches from './components/localSpeeches';
import SpeakButton from './components/speakButton';
// import CharacterControls from './components/characterControls';
import { CharacterContext } from './context/characterContext';
import { useCharacter } from './hooks/useCharacter';
import './styles/app.css'

export default function AvatarApp({
  modelUrl = '/models/Model1.glb',
  audioUrl,
  script,
  children
}: {
  modelUrl?: string;
  audioUrl?: string;
  script?: string;
  children?: React.ReactNode;
}) {
  const character = useCharacter(modelUrl);

  // Disable control: character.controlsRef.current.enabled = false;
  // Enable control: character.controlsRef.current.enabled = true;
  if (character.controlsRef.current) {
    character.controlsRef.current.enabled = true;
  }

  return (
    <CharacterContext.Provider value={{ speak: character.speak, speakLocal: character.speakLocal }}>
      <SceneCanvas canvasRef={character.canvasRef} />
      {/* User input speeches component */}
      {/* <SpeechControls /> */}
      {/* Preset speeches buttons component */}
      {/* <LocalSpeeches /> */}

      {children !== undefined ? (
        children
      ) : (
        audioUrl && script && (
          <SpeakButton
            audioUrl={audioUrl}
            script={script}
          />
        )
      )}

      {/* Uncommneted this and the import to use control panel component */}
      {/* {character.ready && character.controller && (
        <CharacterControls
          actions={character.actions}
          controller={character.controller}
          morphTargets={character.morphTargets}
        />
      )} */}
    </CharacterContext.Provider>
  );
}