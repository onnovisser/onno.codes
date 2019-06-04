function createDeferredPromise() {
  let resolve;
  let reject;
  const promise = new Promise((yay, nay) => {
    reject = nay;
    resolve = val => {
      promise.resolved = val;
      promise.isResolved = true;
      yay(val);
    };
  });
  promise.resolve = resolve;
  promise.reject = reject;

  return promise;
}

export default createDeferredPromise;
