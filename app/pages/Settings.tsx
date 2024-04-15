import { isNil } from "ramda";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import NavBar from "~/components/NavBar";
import RangeInput, { css as rangeInputCss } from "~/components/RangeInput";
import SelectInput from "~/components/SelectInput";
import useLocalStorage from "~/hooks/useLocalStorage";
import useSpeechContext from "~/hooks/useSpeechContext";
import style from "./Settings.css?url";

export const css = [{ rel: "stylesheet", href: style }, ...rangeInputCss];

function Settings() {
  const { state: storedSettings, setState: setStoredSettings } =
    useLocalStorage("app:speech", { pitch: 1, rate: 1, volume: 1 });
  const [speechSettings, setSpeechSettings] = useState({
    pitch: 1,
    rate: 1,
    volume: 1,
  });
  const [isRendered, setIsRendered] = useState(false);
  useEffect(() => {
    if (isRendered || isNil(storedSettings)) {
      return;
    }
    setSpeechSettings(storedSettings);
    setIsRendered(true);
  }, [speechSettings, storedSettings, isRendered]);
  const { voices, voice } = useSpeechContext();
  const { setState: setVoice, removeState } = useLocalStorage("app:voice");
  const onSave = () => {
    setStoredSettings(speechSettings);
  };
  const onReset = () => {
    const initialSettings = {
      pitch: 1,
      rate: 1,
      volume: 1,
    };
    setStoredSettings(initialSettings);
    setSpeechSettings(initialSettings);
    removeState();
  };

  return (
    <div className="Settings w-full max-w-[820px] mx-auto h-full px-8">
      <NavBar />
      <main className="flex flex-col w-full h-full py-4 gap-y-2 sm:gap-y-4">
        <h1 className="text-2xl font-bold ">Application Settings</h1>
        <hr />
        <h2 className="text-xl font-semibold">Speech</h2>
        <article className="flex flex-col gap-y-6">
          <RangeInput
            min={0}
            max={2}
            label="Pitch"
            step={0.01}
            value={speechSettings.pitch}
            onChange={(pitch) => {
              setSpeechSettings((state) => ({
                ...state,
                pitch,
              }));
            }}
          />
          <RangeInput
            min={0.1}
            max={10}
            label="Rate"
            step={0.01}
            value={speechSettings.rate}
            onChange={(rate) => {
              setSpeechSettings((state) => ({
                ...state,
                rate,
              }));
            }}
          />
          <RangeInput
            min={0}
            max={1}
            label="Volume"
            step={0.01}
            value={speechSettings.volume}
            onChange={(volume) => {
              setSpeechSettings((state) => ({
                ...state,
                volume,
              }));
            }}
          />
          <SelectInput
            label="Voice"
            disabled={voices.length === 0}
            options={voices}
            value={voice}
            onChange={(nextVoice) => {
              setVoice(nextVoice.name);
            }}
          >
            {(voice) => {
              return voice?.name;
            }}
          </SelectInput>
          <div className="flex gap-x-1">
            <Button
              className="flex justify-center w-full py-1"
              onClick={() => onSave()}
            >
              <span className="inline-flex">Save</span>
            </Button>
            <Button
              className="flex justify-center w-full py-1 column200:w-40"
              onClick={() => onReset()}
              action="secondary"
            >
              <span className="inline-flex">Reset</span>
            </Button>
          </div>
        </article>
        <hr />
        <section className="flex flex-col gap-y-1">
          <h3 className="text-base font-semibold">When no voices found</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            <li>You can check translation settings in the web browser.</li>
            <li>
              You can check text-to-speech settings in the mobile devices.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Settings;
