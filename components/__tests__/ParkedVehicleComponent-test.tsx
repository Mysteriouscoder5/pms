import * as React from "react";
import ParkedVehicle, {
  ParkedVehicle as ParkedVehicleComponent,
} from "@/components/ParkedVehicle";
import { render, fireEvent } from "@testing-library/react-native";
import { renderWithProviders } from "@/utils/test-utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

describe("<ParkedVehicle />", () => {
  let instance: any;
  let screen: any;
  beforeEach(() => {
    screen = renderWithProviders(<ParkedVehicle />);
    instance = screen.UNSAFE_getByType(ParkedVehicleComponent).instance;
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(<ParkedVehicle />);
    expect(getByTestId("parked-vehicle")).toBeTruthy();
  });

  it("should render initial props and state correctly", () => {
    const { props, state } = instance;
    expect(state).toEqual({
      parkingDurationHours: 0,
      parkingDurationMinutes: 0,
      parkingCharge: 10,
    });
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

  // it("should correctly render parked vehicle details", () => {
  //   const { getByText } = screen;
  //   const { props } = instance;
  //   expect(getByText(`PNo. ${props.parkedVehicle?.number}`)).toBeTruthy();
  //   expect(getByText(props.parkedVehicle?.ownerName)).toBeTruthy();
  //   expect(getByText(props.parkedVehicle?.ownerContactNumber)).toBeTruthy();
  //   expect(getByText(props.parkedVehicle?.vehicleNumber)).toBeTruthy();
  //   expect(getByText(props.parkedVehicle?.parkingTime)).toBeTruthy();
  // });

  //   it("should calculate and display correct parking duration and charges", () => {
  //     const mockCurrentTime = moment("12:30:00", "HH:mm:ss");
  //     jest
  //       .spyOn(moment.prototype, "diff")
  //       .mockReturnValue(mockCurrentTime.diff(moment("10:00:00", "HH:mm:ss")));

  //     expect(screen.getByText("2 hrs")).toBeTruthy();
  //     expect(screen.getByText("$10")).toBeTruthy();
  //   });

  it("should remove parked vehicle from AsyncStorage when 'PROCEED TO PAY' is pressed", async () => {
    const { getByText } = screen;

    const button = getByText("PROCEED TO PAY");
    fireEvent.press(button);

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("parkedVehicle");
  });
});
