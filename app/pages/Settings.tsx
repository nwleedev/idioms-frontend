import { isNil } from "ramda";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import NavBar from "~/components/NavBar";
import RangeInput, { css as rangeInputCss } from "~/components/RangeInput";
import useLocalStorage from "~/hooks/useLocalStorage";
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
  const onSave = () => {
    setStoredSettings(speechSettings);
  };
  const [isRendered, setIsRendered] = useState(false);
  useEffect(() => {
    if (isRendered || isNil(storedSettings)) {
      return;
    }
    setSpeechSettings(storedSettings);
    setIsRendered(true);
  }, [speechSettings, storedSettings, isRendered]);

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
          <Button
            className="max-w-[600px] justify-center"
            onClick={() => onSave()}
          >
            <span className="inline-flex">Save</span>
          </Button>
        </article>
      </main>
    </div>
  );
}

export default Settings;
