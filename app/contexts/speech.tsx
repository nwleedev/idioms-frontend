import { Dispatch, PropsWithChildren, createContext, useReducer } from "react";
import { IdiomExample } from "~/types/idiom";

export interface AppSpeech {
  isPlaying: boolean;
  hasWordClick: boolean;
  voices: SpeechSynthesisVoice[];
  idiom?: IdiomExample;
}

export type SpeechAction =
  | {
      key: "SPEECH/VOICES";
      payload: {
        voices: SpeechSynthesisVoice[];
      };
    }
  | {
      key: "SPEECH/IDIOM_PLAY";
      payload: {
        idiom: IdiomExample;
      };
    }
  | {
      key: "SPEECH/IDIOM_PAUSE";
    }
  | {
      key: "SPEECH/IDIOM_STOP";
    }
  | {
      key: "SPEECH/IDIOM_RESUME";
    }
  | {
      key: "SPEECH/IDIOM_WORD_CLICK_ON";
    }
  | {
      key: "SPEECH/IDIOM_WORD_CLICK_OFF";
    };

export const SpeechContext = createContext({
  store: undefined! as AppSpeech,
  dispatch: undefined! as Dispatch<SpeechAction>,
});

const speechReducer = (state: AppSpeech, action: SpeechAction) => {
  const { key } = action;
  switch (key) {
    case "SPEECH/VOICES": {
      const { payload } = action;
      state = {
        ...state,
        voices: payload.voices,
      };
      break;
    }
    case "SPEECH/IDIOM_PLAY": {
      const { payload } = action;
      state = {
        ...state,
        idiom: payload.idiom,
        isPlaying: true,
      };
      break;
    }
    case "SPEECH/IDIOM_PAUSE": {
      state = {
        ...state,
        isPlaying: false,
      };
      break;
    }
    case "SPEECH/IDIOM_STOP": {
      state = {
        ...state,
        isPlaying: false,
        idiom: undefined,
      };
      break;
    }
    case "SPEECH/IDIOM_RESUME": {
      state = {
        ...state,
        isPlaying: true,
      };
      break;
    }
    case "SPEECH/IDIOM_WORD_CLICK_ON": {
      state = {
        ...state,
        hasWordClick: true,
      };
      break;
    }
    case "SPEECH/IDIOM_WORD_CLICK_OFF": {
      state = {
        ...state,
        hasWordClick: false,
      };
    }
  }
  return state;
};

export const SpeechProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [store, dispatch] = useReducer(speechReducer, {
    isPlaying: false,
    hasWordClick: false,
    idiom: undefined,
    voices: [],
  } satisfies AppSpeech);

  return (
    <SpeechContext.Provider value={{ store, dispatch }}>
      {children}
    </SpeechContext.Provider>
  );
};
