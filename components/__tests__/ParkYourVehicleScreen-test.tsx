import * as React from "react";
import ParkYourVehicle, {
  ParkYourVehicle as ParkYourVehicleComponent,
} from "@/app/(tabs)/ParkYourVehicle";
import { render, fireEvent } from "@testing-library/react-native";
import { renderWithProviders } from "@/utils/test-utils";
import { Alert } from "react-native";

describe("<ParkYourVehicle />", () => {
  let instance: any;

  beforeEach(() => {
    const { UNSAFE_getByType } = renderWithProviders(<ParkYourVehicle />);
    instance = UNSAFE_getByType(ParkYourVehicleComponent).instance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByTestId } = renderWithProviders(<ParkYourVehicle />);
    expect(instance).toBeTruthy();
    expect(getByText("Park Your Vehicle")).toBeTruthy();
    expect(getByTestId("owner-name")).toBeTruthy();
    expect(getByTestId("contact-number")).toBeTruthy();
    expect(getByTestId("vehicle-number")).toBeTruthy();
    expect(getByText("PARK")).toBeTruthy();
  });

  it("should correctly render initial state and props", () => {
    const screen = renderWithProviders(<ParkYourVehicle />);
    const instance = screen.UNSAFE_getByType(ParkYourVehicleComponent).instance;

    expect(instance.state.ownerName).toEqual("");
    expect(instance.state.vehicleNumber).toEqual("");
    expect(instance.state.contactNumber).toEqual("");
    expect(instance.state.currentDate).toMatch(/^\d{2}-\d{2}-\d{4}$/); // Matches "DD-MM-YYYY"
    expect(instance.state.currentTime).toMatch(/^\d{2}:\d{2}:\d{2}$/); // Matches "HH:MM:SS"
  });

  it("updates input fields correctly", () => {
    const { getByTestId } = renderWithProviders(<ParkYourVehicle />);

    const ownerNameInput = getByTestId("owner-name");
    const contactNumberInput = getByTestId("contact-number");
    const vehicleNumberInput = getByTestId("vehicle-number");

    fireEvent.changeText(ownerNameInput, "John Doe");
    fireEvent.changeText(contactNumberInput, "1234567890");
    fireEvent.changeText(vehicleNumberInput, "ABC1234567");

    expect(ownerNameInput.props.value).toBe("John Doe");
    expect(contactNumberInput.props.value).toBe("1234567890");
    expect(vehicleNumberInput.props.value).toBe("ABC1234567");
  });

  it("should not allow more than 10 characters for contact number and vehicle number", () => {
    const screen = renderWithProviders(<ParkYourVehicle />);

    fireEvent.changeText(
      screen.getByTestId("contact-number"),
      "12345678901234"
    );
    expect(screen.getByTestId("contact-number").props.value).toBe("1234567890");

    fireEvent.changeText(screen.getByTestId("vehicle-number"), "ABCD123456789");
    expect(screen.getByTestId("vehicle-number").props.value).toBe("ABCD123456");
  });

  it("should correctly set the current date in updateDate function", () => {
    const mockDate = new Date(2024, 8, 9);
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const setStateSpy = jest.spyOn(instance, "setState");
    instance.updateDate();
    expect(setStateSpy).toHaveBeenCalledWith({ currentDate: "09-09-2024" });
  });

  it("should correctly set the current time in updateTime function", () => {
    const mockDate = new Date(2024, 8, 9, 15, 5, 6);
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    const setStateSpy = jest.spyOn(instance, "setState");
    instance.updateTime();
    expect(setStateSpy).toHaveBeenCalledWith({ currentTime: "15:05:06" });
  });

  it("should call updateTime and updateDate on componentDidMount", () => {
    const updateTimeSpy = jest.spyOn(instance, "updateTime");
    const updateDateSpy = jest.spyOn(instance, "updateDate");

    instance.componentDidMount();

    expect(updateTimeSpy).toHaveBeenCalled();
    expect(updateDateSpy).toHaveBeenCalled();
  });

  it("should set up an interval in componentDidMount", () => {
    const setIntervalSpy = jest.spyOn(global, "setInterval");

    instance.componentDidMount();

    expect(setIntervalSpy).toHaveBeenCalledWith(instance.updateTime, 1000);
  });

  it("should clear the interval in componentWillUnmount", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");

    instance.intervalId = 1234;

    instance.componentWillUnmount();

    expect(clearIntervalSpy).toHaveBeenCalledWith(1234);
  });
});

// describe("ParkYourVehicle handlePark function", () => {
//   let instance: any;
//   let mockProps: any;
//   beforeEach(() => {
//     mockProps = {
//       loading: false,
//       lots: [],
//       availableLots: [{ id: 1, occupied: false }], // Provide a lot to avoid the no lots condition
//       parkToAvailableLots: jest.fn(),
//       removeParkedVehicle: jest.fn(),
//       setInitialParkingLots: jest.fn(),
//     };
//     const { UNSAFE_getByType } = renderWithProviders(
//       <ParkYourVehicle {...mockProps} />
//     );
//     instance = UNSAFE_getByType(ParkYourVehicleComponent).instance;
//     jest.spyOn(Alert, "alert").mockImplementation(() => {});
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it("should show an alert when there are no available lots", () => {
//     instance.props.availableLots = [];
//     instance.handlePark();
//     expect(Alert.alert).toHaveBeenCalledWith(
//       "Cannot Park Your Vehicle !",
//       "All the parking lots are currently unavailable",
//       [{ text: "OK", onPress: expect.any(Function) }]
//     );
//     expect(mockProps.parkToAvailableLots).not.toHaveBeenCalledWith(
//       expect.anything()
//     );
//   });

//   it("should show an alert if required fields are missing", () => {
//     instance.setState({
//       ownerName: "",
//       vehicleNumber: "",
//       contactNumber: "",
//     });
//     instance.handlePark();
//     expect(Alert.alert).toHaveBeenCalledWith(
//       "Please Fill The Above Details !",
//       "",
//       [{ text: "OK", onPress: expect.any(Function) }]
//     );

//     expect(mockProps.parkToAvailableLots).not.toHaveBeenCalledWith(
//       expect.anything() // Ensure no action is dispatched
//     );
//   });

//   it("should park the vehicle when all data is provided", () => {
//     instance.setState({
//       ownerName: "John Doe",
//       vehicleNumber: "abc1234",
//       contactNumber: "1234567890",
//       currentDate: "09-09-2024",
//       currentTime: "15:05:06",
//     });

//     instance.handlePark();
//     expect(mockProps.parkToAvailableLots).toHaveBeenCalledWith(
//       expect.objectContaining({
//         type: "lots/parkToAvailableLots",
//         payload: {
//           ownerName: "John Doe",
//           ownerContactNumber: "123 456 7890",
//           parkingDate: "09-09-2024",
//           parkingTime: "15:05:06",
//           vehicleNumber: "ABC 123 4",
//         },
//       })
//     );

//     expect(instance.state).toEqual({
//       ownerName: "",
//       vehicleNumber: "",
//       contactNumber: "",
//       currentDate: "09-09-2024",
//       currentTime: "15:05:06",
//     });
//   });
// });
