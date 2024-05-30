import { IChildren } from "../interfaces/children-interface";

function BuildProviderTree(providers: Array<any>): any {
  if (providers.length === 0) {
    return null;
  }

  if (providers.length === 1) {
    return providers[0];
  }

  const A = providers.shift();
  const B = providers.shift();

  return BuildProviderTree([
    ({ children }: IChildren) => (
      <A>
        <B>{children}</B>
      </A>
    ),
    ...providers,
  ]);
}

export default BuildProviderTree;
