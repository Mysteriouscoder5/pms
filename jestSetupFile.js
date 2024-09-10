jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// jest.mock('redux-persist', () => {
//   const real = jest.requireActual('redux-persist');
//   return {
//     ...real,
//     persistReducer: jest
//       .fn()
//       .mockImplementation((config, reducers) => reducers),
//   };
// });

// jest.mock("redux-persist", () => ({
//   persistReducer: (config, reducers) => reducers,
//   persistStore: jest.fn(() => ({
//     purge: jest.fn(),
//     flush: jest.fn().mockResolvedValue(null),
//   })),
// }));

jest.mock("redux-persist/integration/react", () => ({
  PersistGate: (props) => props.children,
}));
