import { useState } from 'react';
import TempleteAdd from './templete/TempleteAdd';
import TempleteAllList from './templete/TempleteAllList';

function TempleteDash() {
  const [refreshTempletes, setRefreshTempletes] = useState<boolean>(false);

  return (
    <>
      <TempleteAdd setRefreshTempletes={setRefreshTempletes} />
      <TempleteAllList refreshTempletes={refreshTempletes} setRefreshTempletes={setRefreshTempletes} />
    </>
  );
}

export default TempleteDash;
