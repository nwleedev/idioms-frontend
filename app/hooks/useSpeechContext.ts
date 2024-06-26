import { isNotNil } from "ramda";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useTransition,
} from "react";
import { SpeechContext } from "~/contexts/speech";
import { IdiomExample } from "~/types/idiom";
import useLocalStorage from "./useLocalStorage";

const useSpeechContext = () => {
  const {
    store: { isPlaying, hasWordClick: hasWordClickContext, idiom, voices },
    dispatch,
  } = useContext(SpeechContext);
  // const [voice, setVoice] = useState(null as SpeechSynthesisVoice | null)
  const { state: voiceName } = useLocalStorage<"app:voice", string>(
    "app:voice"
  );
  const voice = useMemo(() => {
    return voices.find((voice) => voice.name === voiceName) ?? voices[0];
  }, [voices, voiceName]);
  const speechRef = useRef(null as SpeechSynthesis | null);
  const utteranceRef = useRef(null as SpeechSynthesisUtterance | null);
  const { state: speechSettings } = useLocalStorage("app:speech", {
    pitch: 1,
    rate: 1,
    volume: 1,
  });
  const [, transition] = useTransition();
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.speechSynthesis === "undefined" ||
      typeof window.SpeechSynthesisUtterance === "undefined"
    ) {
      return;
    }
    speechRef.current = window.speechSynthesis;
    utteranceRef.current =
      new window.SpeechSynthesisUtterance() as SpeechSynthesisUtterance;
  }, []);
  const { state: hasWordClickStore, setState: setStoredWordClick } =
    useLocalStorage("app:wordClick", false);
  const hasWordClick = useMemo(() => {
    return hasWordClickContext || hasWordClickStore;
  }, [hasWordClickContext, hasWordClickStore]);

  useEffect(() => {
    const interval = 100;
    let timer: NodeJS.Timeout;
    const onTimeout = function () {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        timer = setTimeout(onTimeout, interval);
        return;
      }
      const enUS = /\ben.US\b/gi;
      const nextVoices = voices.filter((voice) => enUS.test(voice.lang));
      if (!nextVoices) {
        return;
      }
      transition(() => {
        dispatch({ key: "SPEECH/VOICES", payload: { voices: nextVoices } });
      });
      clearTimeout(timer);
    };
    timer = setTimeout(onTimeout, interval);
    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  const onPlay = useCallback(
    (example: IdiomExample) => {
      if (!voice) {
        return;
      }
      if (!speechRef.current || !utteranceRef.current) {
        console.warn("window is undefined now");
        return;
      }
      speechRef.current.cancel();

      utteranceRef.current.text = example.content;
      utteranceRef.current.voice = voice;
      if (isNotNil(speechSettings)) {
        utteranceRef.current.pitch = speechSettings.pitch;
        utteranceRef.current.rate = speechSettings.rate;
        utteranceRef.current.volume = speechSettings.volume;
      }

      speechRef.current.speak(utteranceRef.current);
      dispatch({ key: "SPEECH/IDIOM_PLAY", payload: { idiom: example } });
    },
    [dispatch, voice, speechSettings]
  );

  const onPlayMiddle = useCallback(
    (example: IdiomExample, wordIndex: number) => {
      if (!voice) {
        return;
      }
      if (!speechRef.current || !utteranceRef.current) {
        console.warn("window is undefined now");
        return;
      }
      let content = example.content;
      const word = /\w/;
      for (let index = wordIndex; index > 0; index--) {
        const char = content[index];
        if (!word.test(char)) {
          content = content.slice(index + 1);
          break;
        }
      }
      speechRef.current.cancel();

      utteranceRef.current.text = content;
      utteranceRef.current.voice = voice;
      speechRef.current.speak(utteranceRef.current);
      dispatch({
        key: "SPEECH/IDIOM_PLAY",
        payload: { idiom: { ...example, content } },
      });
    },
    [dispatch, voice]
  );

  const onPause = useCallback(() => {
    if (!speechRef.current) {
      console.warn("window is undefined");
      return;
    }
    speechRef.current.pause();
    dispatch({ key: "SPEECH/IDIOM_PAUSE" });
  }, [dispatch]);

  const onResume = useCallback(() => {
    if (!speechRef.current) {
      console.warn("window is undefined");
      return;
    }
    speechRef.current.resume();
    dispatch({ key: "SPEECH/IDIOM_RESUME" });
  }, [dispatch]);

  const onStop = useCallback(() => {
    if (!speechRef.current) {
      console.warn("window is undefined");
      return;
    }
    speechRef.current.cancel();
    dispatch({ key: "SPEECH/IDIOM_STOP" });
  }, [dispatch]);

  const onToggle = useCallback(() => {
    if (hasWordClick) {
      dispatch({ key: "SPEECH/IDIOM_WORD_CLICK_OFF" });
      setStoredWordClick(false);
    } else {
      dispatch({ key: "SPEECH/IDIOM_WORD_CLICK_ON" });
      setStoredWordClick(true);
    }
  }, [dispatch, setStoredWordClick, hasWordClick]);

  useEffect(() => {
    const onSpeechStop = function () {
      dispatch({ key: "SPEECH/IDIOM_STOP" });
    };
    const refCopy = utteranceRef.current;
    refCopy?.addEventListener("end", onSpeechStop);
    return () => {
      refCopy?.removeEventListener("end", onSpeechStop);
    };
  }, [dispatch]);

  return {
    isPlaying,
    hasWordClick,
    idiom,
    voices,
    voice,
    onPlay,
    onPlayMiddle,
    onPause,
    onResume,
    onStop,
    onToggle,
  };
};

export default useSpeechContext;
