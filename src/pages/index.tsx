import Head from 'next/head';
import React from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { about } from '../utils/bin';
import BootSequence from '../components/boot';
import FullScreenWaves from '../components/waves';
import MatrixRain from '../components/matrix';
interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
  triggerEffect: () => void;
  showEffect: boolean;
}

const IndexPage: React.FC<IndexPageProps> = ({
  inputRef,
  triggerEffect,
  showEffect,
}) => {
  const containerRef = React.useRef(null);
  const [isBooting, setIsBooting] = React.useState(true);
  const [showWaves, setShowWaves] = React.useState(false);
  const [showMatrix, setShowMatrix] = React.useState(false);
  const {
    history,
    command,
    lastCommandIndex,
    newestId,
    setCommand,
    setHistory,
    clearHistory,
    setLastCommandIndex,
  } = useHistory([
    { 
      id: 0, 
      date: new Date(), 
      command: '', 
      output: about(), 
      path: '~',
      showPrompt: false
    }
  ]);



  React.useEffect(() => {
    if (inputRef.current) {
      const isScrollNeeded =
        containerRef.current.scrollHeight - containerRef.current.scrollTop >
        containerRef.current.clientHeight;

      if (isScrollNeeded) {
        inputRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
      inputRef.current.focus({ preventScroll: true });
    }
  }, [history]);

  const handleWavesComplete = React.useCallback(() => {
    setShowWaves(false);
  }, []);

  const handleMatrixComplete = React.useCallback(() => {
    setShowMatrix(false);
  }, []);

  if (isBooting) {
    return (
      <div className="p-2 overflow-hidden h-full rounded border-light-yellow dark:border-dark-yellow">
        <BootSequence onComplete={() => setIsBooting(false)} />
      </div>
    );
  }
  return (
    <>
      {showWaves && <FullScreenWaves onComplete={handleWavesComplete} />}
      {showMatrix && <MatrixRain onComplete={handleMatrixComplete} />}
      <Head>
        <title>{config.title}</title>
      </Head>

      <div className="p-2 overflow-hidden h-full rounded border-light-yellow dark:border-dark-yellow">
        <div ref={containerRef} className="overflow-y-auto h-full">
          <History
            history={history}
            showEffect={showEffect}
            newestId={newestId}
          />
          <Input
            inputRef={inputRef}
            containerRef={containerRef}
            command={command}
            history={history}
            lastCommandIndex={lastCommandIndex}
            setCommand={setCommand}
            setHistory={setHistory}
            setLastCommandIndex={setLastCommandIndex}
            clearHistory={clearHistory}
            triggerEffect={triggerEffect}
            setShowWaves={setShowWaves}
            setShowMatrix={setShowMatrix}
          />
        </div>
      </div>
    </>
  );
};

export default IndexPage;
