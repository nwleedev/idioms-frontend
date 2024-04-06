import {
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  SpeakerWaveIcon as SpeakerOutlineIcon,
} from "@heroicons/react/24/outline";
import { SpeakerWaveIcon as SpeakerSolidIcon } from "@heroicons/react/24/solid";
import { useCallback, useState } from "react";
import useSpeechContext from "~/hooks/useSpeechContext";
import { IdiomExample } from "~/types/idiom";
import Translate from "../Translate";

export interface ExampleProps {
  example: IdiomExample;
}

const Example = (props: ExampleProps) => {
  const { example } = props;
  const {
    isPlaying,
    idiom,
    hasWordClick,
    onPlay,
    onPause,
    onPlayMiddle,
    onResume,
    onStop,
  } = useSpeechContext();
  const [isCopyed, setIsCopyed] = useState(false);
  const onCopy = useCallback(async (example: string) => {
    await window.navigator.clipboard.writeText(example);

    setIsCopyed(() => true);
    setTimeout(() => {
      setIsCopyed(() => false);
    }, 3000);
  }, []);

  const onClick = useCallback(() => {
    if (idiom === undefined) {
      return onPlay(example);
    }
    if (idiom.index !== example.index) {
      return onPlay(example);
    }
    if (idiom.index === example.index && isPlaying) {
      return onPause();
    }
    if (idiom.index === example.index && !isPlaying) {
      return onResume();
    }
  }, [example, idiom, isPlaying, onPlay, onPause, onResume]);

  return (
    <div className="py-2 flex flex-col gap-y-1">
      <div className="flex items-center gap-x-2">
        <p
          className="font-light font-Work_Sans text-gray-900"
          onClick={() => {
            const selection = window.getSelection();
            if (
              hasWordClick &&
              selection &&
              selection.focusNode instanceof Text
            ) {
              onPlayMiddle(example, selection.focusOffset);
            }
          }}
          onContextMenu={(event) => event.preventDefault()}
        >
          {example.content}
        </p>
        <div className="flex gap-x-1">
          {isPlaying && idiom?.index === example.index ? (
            <button
              onClick={() => {
                onStop();
              }}
            >
              <SpeakerSolidIcon className="w-6 font-light" strokeWidth={1} />
            </button>
          ) : (
            <button
              onClick={() => {
                onClick();
              }}
            >
              <SpeakerOutlineIcon className="w-6 font-light" strokeWidth={1} />
            </button>
          )}
          {isCopyed ? (
            <DocumentCheckIcon className="w-6 font-light" strokeWidth={1} />
          ) : (
            <button onClick={() => onCopy(example.content)}>
              <DocumentDuplicateIcon
                className="w-6 font-light"
                strokeWidth={1}
              />
            </button>
          )}
        </div>
      </div>
      <Translate
        key={`translate:${example}`}
        className="font-light text-gray-700 text-sm"
      >
        {example.content}
      </Translate>
    </div>
  );
};

export default Example;
