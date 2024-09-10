import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SIZES } from "../..//constants/Theme";
import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Form,
  H2,
  H3,
  Input,
  Label,
  Paragraph,
  ScrollView,
  YStack,
} from "tamagui";
import { ConnectedProps } from "react-redux";
import { lotsReducerConnector } from "@/redux/reducers/lotsReducer";
import { Lot } from ".";
import ParkedVehicle from "@/components/ParkedVehicle";

interface State {
  ownerName: string;
  vehicleNumber: string;
  contactNumber: string;
  currentTime: string;
  currentDate: string;
}
type ParkYourVehicleProp = ConnectedProps<typeof lotsReducerConnector>;
export class ParkYourVehicle extends Component<ParkYourVehicleProp, State> {
  intervalId: NodeJS.Timeout | null = null;
  constructor(props: ParkYourVehicleProp) {
    super(props);
    this.state = {
      ownerName: "",
      vehicleNumber: "",
      contactNumber: "",
      currentTime: "",
      currentDate: "",
    };
  }

  componentDidMount() {
    this.updateTime();
    this.updateDate();
    this.intervalId = setInterval(this.updateTime, 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  updateDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = now.getDate().toString().padStart(2, "0");

    const currentDate = `${day}-${month}-${year}`;
    this.setState({ currentDate });
  };
  updateTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    this.setState({ currentTime: `${hours}:${minutes}:${seconds}` });
  };

  handlePark = () => {
    const { lots, availableLots, parkToAvailableLots, parkedVehicle } =
      this.props;

    if (availableLots.length === 0) {
      Alert.alert(
        "Cannot Park Your Vehicle !",
        "All the parking lots are currently unavailable",
        [{ text: "OK", onPress: () => {} }]
      );
      return;
    }
    const {
      ownerName,
      currentDate,
      currentTime,
      vehicleNumber,
      contactNumber,
    } = this.state;
    if (
      ownerName.length === 0 ||
      vehicleNumber.length === 0 ||
      contactNumber.length === 0
    ) {
      Alert.alert("Please Fill The Above Details !", "", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    const data: Partial<Lot> = {
      ownerName: ownerName,
      ownerContactNumber: `${contactNumber.slice(0, 3)} ${contactNumber.slice(
        3,
        6
      )} ${contactNumber.slice(6, 10)}`,
      parkingDate: currentDate,
      parkingTime: currentTime,
      vehicleNumber: `${vehicleNumber.toUpperCase().slice(0, 3)} ${vehicleNumber
        .toUpperCase()
        .slice(3, 6)} ${vehicleNumber.toUpperCase().slice(6, 10)}`,
    };
    parkToAvailableLots(data);

    this.setState({
      ownerName: "",
      contactNumber: "",
      vehicleNumber: "",
    });
  };

  render() {
    const { lots, availableLots, parkToAvailableLots, parkedVehicle } =
      this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SafeAreaView>
          <View style={[styles.titleContainer, { flexDirection: "column" }]}>
            <H2 fontWeight={"bold"}>Park Your Vehicle</H2>
            <Paragraph fontWeight={"normal"}>
              Current Date » {this.state.currentDate}
            </Paragraph>
            <Paragraph fontWeight={"normal"}>
              Current Time » {this.state.currentTime}
            </Paragraph>
          </View>
          <ScrollView style={{ padding: SIZES.s, minHeight: "100%" }}>
            {parkedVehicle !== undefined ? (
              <ParkedVehicle />
            ) : (
              <YStack
                borderWidth={1}
                borderRadius="$4"
                backgroundColor="$background"
                borderColor="$borderColor"
                padding={SIZES.s}
                gap="$4"
                testID="vehicle-input-form"
              >
                <YStack>
                  <Label htmlFor="owner-name" fontSize={SIZES.m}>
                    Owner name
                  </Label>
                  <Input
                    id="owner-name"
                    value={this.state.ownerName}
                    onChangeText={(text) => this.setState({ ownerName: text })}
                    testID="owner-name"
                  />
                </YStack>
                <YStack>
                  <Label htmlFor="contact-number" fontSize={SIZES.m}>
                    Contact number
                  </Label>
                  <Input
                    id="contact-number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={this.state.contactNumber}
                    onChangeText={(text) =>
                      this.setState({ contactNumber: text.slice(0, 10) })
                    }
                    testID="contact-number"
                  />
                </YStack>
                <YStack>
                  <Label htmlFor="vehicle-number" fontSize={SIZES.m}>
                    Vehicle number
                  </Label>
                  <Input
                    id="vehicle-number"
                    maxLength={10}
                    value={this.state.vehicleNumber}
                    onChangeText={(text) =>
                      this.setState({ vehicleNumber: text.slice(0, 10) })
                    }
                    testID="vehicle-number"
                  />
                </YStack>

                <Button
                  marginTop="$4"
                  fontSize={SIZES.m}
                  fontWeight={"bold"}
                  size={"$5"}
                  theme={"blue"}
                  onPress={() => {
                    this.handlePark();
                  }}
                >
                  PARK
                </Button>
              </YStack>
            )}
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

export default lotsReducerConnector(ParkYourVehicle);

const styles = StyleSheet.create({
  titleContainer: {
    padding: SIZES.xs,
  },
});
