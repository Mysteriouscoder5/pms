import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Lot } from "@/app/(tabs)";
import { connect } from "react-redux";

interface LotsState {
  loading: boolean;
  lots: Lot[];
  availableLots: Lot[];
  parkedVehicle?: Lot;
}

const initialState: LotsState = {
  loading: false,
  lots: [],
  availableLots: [],
  parkedVehicle: undefined,
};

export const lotsSlice = createSlice({
  name: "lots",
  initialState,
  reducers: {
    removeParkedVehicle: (state) => {
      if (state.parkedVehicle) {
        state.lots = state.lots.map((lot) =>
          lot.number === state.parkedVehicle?.number
            ? {
                ...lot,
                occupied: false,
                ownerName: undefined,
                ownerContactNumber: undefined,
                vehicleNumber: undefined,
                parkingDate: undefined,
                parkingTime: undefined,
              }
            : lot
        );

        const newAvailableLot = {
          id: state.parkedVehicle.id,
          number: state.parkedVehicle.number,
          occupied: false,
        };

        state.availableLots.push(newAvailableLot);
        state.parkedVehicle = undefined;
      }
    },
    parkToAvailableLots: (state, action: PayloadAction<Partial<Lot>>) => {
      if (state.availableLots.length === 0) return;
      const randomIndex = Math.floor(
        Math.random() * state.availableLots.length
      );

      const selectedLot = state.availableLots[randomIndex];
      const lotIndex = state.lots.findIndex((lot) => lot.id === selectedLot.id);
      if (lotIndex !== -1) {
        state.lots[lotIndex] = {
          ...state.lots[lotIndex],
          occupied: true,
          ...action.payload,
        };
        state.availableLots = state.lots.filter((lot) => !lot.occupied);
      }

      state.parkedVehicle = state.lots[lotIndex];
    },
    setInitialParkingLots: (state, action: PayloadAction<Lot[]>) => {
      state.lots = action.payload;
      state.availableLots = state.lots.filter((lot) => !lot.occupied);
    },
  },
});

export const {
  setInitialParkingLots,
  parkToAvailableLots,
  removeParkedVehicle,
} = lotsSlice.actions;

export const selectLots = (state: RootState) => state.lots.lots;
export const selectAvailableLots = (state: RootState) =>
  state.lots.availableLots;

const mapState = (state: RootState) => ({
  loading: state.lots.loading,
  lots: state.lots.lots,
  availableLots: state.lots.availableLots,
  parkedVehicle: state.lots.parkedVehicle,
});

const mapDispatch = {
  setInitialParkingLots,
  parkToAvailableLots,
  removeParkedVehicle,
};
export const lotsReducerConnector = connect(mapState, mapDispatch);

export default lotsSlice.reducer;
