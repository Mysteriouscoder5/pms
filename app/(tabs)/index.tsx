import { FlatList, StyleSheet, Text, View } from "react-native";
import "react-native-get-random-values";
import React, { Component } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SIZES } from "@/constants/Theme";
import { Button, Card, H1, H2, H3, Paragraph, XStack, YStack } from "tamagui";
import { LOTS } from "../../libs/data";
import { PhoneCall } from "@tamagui/lucide-icons";
import { connect, ConnectedProps } from "react-redux";
import { lotsReducerConnector } from "@/redux/reducers/lotsReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Lot {
  id: string;
  occupied: boolean;
  number: number;
  ownerName?: string;
  ownerContactNumber?: string;
  vehicleNumber?: string;
  parkingDate?: string;
  parkingTime?: string;
}
interface State {
  lots: Lot[];
  availableLots: unknown[];
}

type ParkingAreaProps = ConnectedProps<typeof lotsReducerConnector>;
export class ParkingArea extends Component<ParkingAreaProps, State> {
  async componentDidMount() {
    const { parkedVehicle, setInitialParkingLots } = this.props;
    let lots = LOTS;
    if (parkedVehicle !== undefined) {
      lots = lots.filter((lot) => lot.number !== parkedVehicle.number);
      lots.splice(parkedVehicle.number - 1, 0, parkedVehicle);
    }
    setInitialParkingLots(lots);
  }

  async componentDidUpdate(prevProps: ParkingAreaProps) {
    const { lots, availableLots, parkedVehicle } = this.props;
    if (
      parkedVehicle !== prevProps.parkedVehicle &&
      parkedVehicle !== undefined
    ) {
      await AsyncStorage.setItem(
        "parkedVehicle",
        JSON.stringify(parkedVehicle)
      );
    }
  }

  render() {
    const { lots, availableLots } = this.props;
    return (
      <SafeAreaView>
        <View style={[styles.titleContainer, { flexDirection: "column" }]}>
          <H2 fontWeight={"bold"}>Parking Area</H2>
          <Paragraph fontWeight={"normal"}>
            Total Lots » {lots.length}
          </Paragraph>
          <Paragraph fontWeight={"normal"}>
            Available Lots » {availableLots.length}
          </Paragraph>
        </View>
        <FlatList
          data={lots}
          renderItem={({ item }) => (
            <Card
              style={[styles.lot]}
              elevate
              bordered
              theme={item.occupied ? "blue" : "green"}
            >
              <YStack padding="$3">
                <H3>PNo. {item.number}</H3>
                {!item.occupied ? (
                  <Paragraph theme="alt2" testID="available">
                    Available
                  </Paragraph>
                ) : null}
              </YStack>
              {item.occupied && (
                <>
                  <YStack padding="$3">
                    <XStack>
                      <Paragraph theme={"alt2"}>Owner Name » </Paragraph>
                      <Paragraph>{item.ownerName}</Paragraph>
                    </XStack>
                    <XStack>
                      <Paragraph theme={"alt2"}>Contact Number » </Paragraph>
                      <Paragraph>{item.ownerContactNumber}</Paragraph>
                    </XStack>
                    <XStack>
                      <Paragraph theme={"alt2"}>Vehicle Number » </Paragraph>
                      <Paragraph>{item.vehicleNumber}</Paragraph>
                    </XStack>
                    <XStack>
                      <Paragraph theme={"alt2"}>Parking Time » </Paragraph>
                      <Paragraph>{item.parkingTime}</Paragraph>
                    </XStack>
                  </YStack>
                  <Card.Footer>
                    <Button
                      icon={<PhoneCall size="$1" />}
                      width={"100%"}
                    ></Button>
                  </Card.Footer>
                </>
              )}
            </Card>
          )}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.lotContainer]}
        />
      </SafeAreaView>
    );
  }
}

export default lotsReducerConnector(ParkingArea);

const styles = StyleSheet.create({
  lotContainer: {
    padding: SIZES.xs,
    rowGap: SIZES.s,
    columnGap: SIZES.s,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    paddingBottom: 120,
  },
  lot: {
    minHeight: 150,
    width: SIZES.width - 2 * SIZES.xs,
  },
  titleContainer: {
    padding: SIZES.xs,
  },
});
