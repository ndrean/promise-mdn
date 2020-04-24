const display = (tag, text) => {
  document.querySelector(tag).insertAdjacentHTML("beforeend", `<p>${text}</p>`);
};

const tSlow = 5000;
const tFast = 2000;

const t = Date.now();
const giveTime = () => Math.round((Date.now() - t) / 1000).toString();

function resolveFast(context, id) {
  display(context, "starting fast promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(display(context, "FAST " + id + " @ " + giveTime()));
    }, tFast);
  });
}

function resolveSlow(context, id) {
  display(context, "starting slow promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(display(context, "SLOW " + id + " @ " + giveTime()));
    }, tSlow);
  });
}

async function sequentialStart() {
  display("#sequential", "starting....");
  await resolveSlow("#sequential", 1);
  await resolveFast("#sequential", 2);

  //   resolveSlow("#sequential", 3).then(resolveFast("#sequential", 4));
}

async function concurrentStart() {
  display("#concurrent", "starting....");
  resolveSlow("#concurrent", 5); // starts timer immediately
  resolveFast("#concurrent", 6); // starts timer immediately
}

async function concurrentPromise() {
  display("#concurrentPromise", "starting....");
  const promises = await Promise.all([
    resolveSlow("#concurrentPromise", 7),
    resolveFast("#concurrentPromise", 8),
  ]);
  return promises;
}

async function parallel() {
  display("#parallelAwait", "starting....");
  // Start 2 "jobs" in parallel and wait for both of them to complete
  await Promise.all([
    await resolveFast("#parallelAwait", 10),
    await resolveSlow("#parallelAwait", 11),
  ]);
}

// This function does not handle errors. See warning below!
async function parallelPromise() {
  display("#parallelPromise", "starting....");
  resolveFast("#parallelPromise", 20).then();
  resolveSlow("#parallelPromise", 21).then();
}

sequentialStart(); // after 2 seconds, logs "slow", then after 1 more second, "fast"

// wait above to finish
setTimeout(concurrentStart, 20000); // after 2 seconds, logs "slow" and then "fast"

// wait again
setTimeout(concurrentPromise, 30000); // same as concurrentStart

// wait again
setTimeout(parallel, 40000); // truly parallel: after 1 second, logs "fast", then after 1 more second, "slow"

// wait again
setTimeout(parallelPromise, 50000); // same as parallel
