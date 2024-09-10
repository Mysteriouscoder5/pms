import * as React from "react";
import ParkingArea, {
  ParkingArea as ParkingAreaComponent,
} from "@/app/(tabs)/index";
import { render, fireEvent } from "@testing-library/react-native";
import { renderWithProviders } from "@/utils/test-utils";
import { LOTS } from "@/libs/data";

describe("<ParkingArea />", () => {
  let instance: any;

  beforeEach(() => {
    const { UNSAFE_getByType } = renderWithProviders(<ParkingArea />);
    instance = UNSAFE_getByType(ParkingAreaComponent).instance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = renderWithProviders(<ParkingArea />);
    const { props } = instance;
    expect(getByText("Parking Area")).toBeTruthy();
    expect(getByText(`Total Lots » ${props.lots.length}`)).toBeTruthy();
    expect(
      getByText(`Available Lots » ${props.availableLots.length}`)
    ).toBeTruthy();
  });

  it("should correctly render initial state and props", () => {
    const { props } = instance;

    expect(props).toEqual({
      loading: false,
      lots: props.lots,
      availableLots: props.availableLots,
      parkedVehicle: props.parkedVehicle,
      setInitialParkingLots: expect.any(Function),
      parkToAvailableLots: expect.any(Function),
      removeParkedVehicle: expect.any(Function),
    });
  });

  // it("should render occupied and available lots correctly", () => {
  //   const { getAllByText, getByText, getAllByTestId } = renderWithProviders(
  //     <ParkingArea />
  //   );
  //   const { props } = instance;
  //   const occupiedLots = props.lots.filter((lot: any) => lot.occupied);

  //   expect(getAllByTestId("available").length).toBe(props.availableLots.length);

  //   if (occupiedLots.length > 0) {
  //     const firstOccupied = occupiedLots[0];
  //     expect(getByText(`PNo. ${firstOccupied.number}`)).toBeTruthy();
  //     expect(getByText(firstOccupied.ownerName || "")).toBeTruthy();
  //     expect(getByText(firstOccupied.ownerContactNumber || "")).toBeTruthy();
  //   }
  // });

  //   it("should render the correct number of lots", () => {
  //     const { getAllByText } = renderWithProviders(<ParkingArea />);
  //     const { props } = instance;
  //     const cardElements = getAllByText(/PNo./);
  //     expect(cardElements.length).toBe(props.lots.length);
  //   });
});
