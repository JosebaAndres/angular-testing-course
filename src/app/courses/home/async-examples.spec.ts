import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {
  it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it("Asynchronous test exameple - settimeou() using tick", fakeAsync(() => {
    let test = false;
    setTimeout(() => {});
    setTimeout(() => {
      console.log("running assertions");
      test = true;
    }, 1000);
    tick(1000);
    expect(test).toBeTruthy();
  }));

  it("Asynchronous test exameple - settimeou() using flush", fakeAsync(() => {
    let test = false;
    setTimeout(() => {});
    setTimeout(() => {
      console.log("running assertions");
      test = true;
    }, 1000);
    flush();
    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example - plain Promise", fakeAsync(() => {
    let test = false;
    console.log("Create promise");
    Promise.resolve().then(() => {
      console.log("Promise first then evaluated succesfully");
      return Promise.resolve().then(() => {
        console.log("Promise second then evaluated succesfully");
        test = true;
      });
    });
    flushMicrotasks();
    console.log("Running test assertion");
    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example - Promises + settimeout()", fakeAsync(() => {
    let counter = 0;
    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });
    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(11);
  }));

  it("Asynchronous test example - sync Observables", () => {
    let test = false;
    console.log("Creating Observable");
    const test$ = of(test);
    test$.subscribe(() => {
      test = true;
    });
    console.log("Running test asserions");
    expect(test).toBeTruthy();
  });

  it("Asynchronous test example - async Observables", fakeAsync(() => {
    let test = false;
    console.log("Creating Observable");
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
      test = true;
    });
    tick(1000);
    console.log("Running test asserions");
    expect(test).toBeTruthy();
  }));
});
