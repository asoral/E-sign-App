import { useState, lazy, Suspense } from 'react';
import OpenSSLButton from './OpenSSL/OpenSSLButton';
const OpenSSLAllList = lazy(() => import('./OpenSSL/OpenSSLAllList'));

function OpenSSL() {
  const [refreshOpenSSL, setRefreshOpenSSL] = useState<boolean>(false);
  const handleRefresh = () => {
    setRefreshOpenSSL((prev) => !prev);
  };
  return (
    <>
      <div>
        <OpenSSLButton onAdd={handleRefresh}/>
      </div>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <OpenSSLAllList refresh={refreshOpenSSL}/>
        </Suspense>
      </div>
    </>
  );
}

export default OpenSSL;
