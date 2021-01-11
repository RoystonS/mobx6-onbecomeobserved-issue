import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  runInAction,
} from 'mobx';

class Lower {
  @observable
  public lowerValue$ = -1;

  public isObserved = false;

  constructor() {
    makeObservable(this);

    onBecomeObserved(
      this,
      'lowerValue$',
      action(() => (this.isObserved = true))
    );
    onBecomeUnobserved(
      this,
      'lowerValue$',
      action(() => (this.isObserved = false))
    );
  }
}
class UpperNotComputed {
  constructor() {
    makeObservable(this);
  }

  @observable.ref
  public lower$: Lower | undefined;

  // @computed
  public get upperValue$() {
    const lower = this.lower$;
    return lower ? lower.lowerValue$ : -Infinity;
  }
}

class UpperComputed {
  constructor() {
    makeObservable(this);
  }

  @observable.ref
  public lower$: Lower | undefined;

  @computed
  public get upperValue$() {
    const lower = this.lower$;
    return lower ? lower.lowerValue$ : -Infinity;
  }
}

function go() {
  const upperComputed = new UpperComputed();
  const upperNotComputed = new UpperNotComputed();
  const lowerForComputed = new Lower();
  const lowerForNotComputed = new Lower();

  // Set up observers
  autorun(() => {
    const value = upperComputed.upperValue$;
  });
  autorun(() => {
    const value = upperNotComputed.upperValue$;
  });

  // Provide the 'lower' values
  runInAction(() => {
    upperComputed.lower$ = lowerForComputed;
    upperNotComputed.lower$ = lowerForNotComputed;
  });

  // Check if the lower values are being observed.
  console.log(`not-computed version ${lowerForNotComputed.isObserved ? "is" : "is NOT" } being observed`);
  console.log(`computed version ${lowerForComputed.isObserved ? "is" : "is NOT" } being observed`);
}

go();

