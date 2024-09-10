import { Lot } from "@/app/(tabs)";
import { lotsReducerConnector } from "@/redux/reducers/lotsReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { ConnectedProps } from "react-redux";
import {
  Button,
  Card,
  H3,
  Paragraph,
  Separator,
  View,
  XStack,
  YStack,
} from "tamagui";
import moment from "moment";
interface Props {
  parkingInfo?: Lot;
}
interface State {
  parkingDurationHours: number;
  parkingDurationMinutes: number;
  parkingCharge: number;
}
type ParkedVehicleProps = ConnectedProps<typeof lotsReducerConnector> & Props;
export class ParkedVehicle extends Component<ParkedVehicleProps, State> {
  constructor(props: ParkedVehicleProps) {
    super(props);
    this.state = {
      parkingDurationHours: 0,
      parkingDurationMinutes: 0,
      parkingCharge: 10,
    };
  }

  componentDidMount(): void {
    const { parkedVehicle } = this.props;
    if (!parkedVehicle?.parkingTime) {
      return;
    }
    const currentTime = moment();
    const parkingTime = moment(parkedVehicle?.parkingTime, "HH:mm:ss");
    if (!parkingTime.isValid()) {
      return;
    }
    const duration = moment.duration(currentTime.diff(parkingTime));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;

    let parkingCharge = 10;
    if (hours > 2) {
      parkingCharge += (hours - 2) * 10;
    }
    this.setState({
      parkingDurationHours: hours,
      parkingDurationMinutes: minutes,
      parkingCharge: parkingCharge,
    });
  }

  async componentDidUpdate(
    prevProps: ParkedVehicleProps,
    prevState: State,
    snapshot?: any
  ) {
    const { parkedVehicle } = this.props;

    if (
      parkedVehicle !== undefined &&
      parkedVehicle !== prevProps.parkedVehicle
    ) {
      await AsyncStorage.setItem(
        "parkedVehicle",
        JSON.stringify(parkedVehicle)
      );
    }
  }

  removeParkedVehicle = async () => {
    await AsyncStorage.removeItem("parkedVehicle");
    this.props.removeParkedVehicle();
  };

  render() {
    const { parkedVehicle } = this.props;

    return (
      <Card
        theme={"blue"}
        elevate
        bordered
        width={"100%"}
        padded
        testID="parked-vehicle"
      >
        <YStack>
          <H3>PNo. {parkedVehicle?.number}</H3>
        </YStack>
        <Separator marginVertical={15} />

        <YStack>
          <XStack>
            <Paragraph theme={"alt2"}>Owner Name » </Paragraph>
            <Paragraph>{parkedVehicle?.ownerName}</Paragraph>
          </XStack>
          <XStack>
            <Paragraph theme={"alt2"}>Contact Number » </Paragraph>
            <Paragraph>{parkedVehicle?.ownerContactNumber}</Paragraph>
          </XStack>
          <XStack>
            <Paragraph theme={"alt2"}>Vehicle Number » </Paragraph>
            <Paragraph>{parkedVehicle?.vehicleNumber}</Paragraph>
          </XStack>
          <XStack>
            <Paragraph theme={"alt2"}>Parking Time » </Paragraph>
            <Paragraph>{parkedVehicle?.parkingTime}</Paragraph>
          </XStack>
        </YStack>
        <Separator marginVertical={15} />
        <YStack>
          <XStack justifyContent="space-between">
            <Paragraph size={"$5"} theme={"alt2"}>
              Parking Duration »
            </Paragraph>
            <Paragraph size={"$5"} fontWeight={"normal"}>
              {this.state.parkingDurationHours > 0
                ? `${this.state.parkingDurationHours} hrs`
                : `${this.state.parkingDurationMinutes} mins`}
            </Paragraph>
          </XStack>
          <XStack justifyContent="space-between">
            <Paragraph size={"$5"} theme={"alt2"}>
              Parking Charges »
            </Paragraph>
            <Paragraph size={"$5"} fontWeight={"normal"}>
              ${this.state.parkingCharge}
            </Paragraph>
          </XStack>
        </YStack>
        <Separator marginVertical={15} />

        <Card.Footer>
          <Button
            width={"100%"}
            fontWeight={"bold"}
            size={"$5"}
            onPress={() => this.removeParkedVehicle()}
          >
            PROCEED TO PAY
          </Button>
        </Card.Footer>
      </Card>
    );
  }
}

export default lotsReducerConnector(ParkedVehicle);
