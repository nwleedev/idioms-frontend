import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import usePrevious from "~/hooks/usePrevious";
import useSpeechContext from "~/hooks/useSpeechContext";

export interface LocationListenerProps {}

const LocationListener = () => {
  const location = useLocation();
  const previousLocation = usePrevious({ value: location });
  const { onStop } = useSpeechContext();

  useEffect(() => {
    if (previousLocation && location.key !== previousLocation.key) {
      onStop();
    }
  }, [location, previousLocation, onStop]);

  return <></>;
};

export default LocationListener;
