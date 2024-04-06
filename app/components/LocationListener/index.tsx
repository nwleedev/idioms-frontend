import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
