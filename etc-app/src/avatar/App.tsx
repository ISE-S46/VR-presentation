import SceneCanvas from './components/sceneCanvas';
// import SpeechControls from './components/speechControls';
import LocalSpeeches from './components/localSpeeches';
// import CharacterControls from './components/characterControls';
import { CharacterContext } from './context/characterContext';
import { useCharacter } from './hooks/useCharacter';
import './styles/styles.css'; // Ensure styles are loaded

export default function AvatarApp({ modelUrl = '/model/LowRes2.glb' }: { modelUrl?: string }) {
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
      <LocalSpeeches />

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