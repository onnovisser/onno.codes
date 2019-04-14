import { useEffect, useState } from 'react';

function BrowserOnlyRender({ children }) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  return render ? children : null;
}

export default BrowserOnlyRender;
