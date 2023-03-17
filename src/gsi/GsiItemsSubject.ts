import {
    IDota2ObserverState, IDota2State,
} from "node-gsi";
import GsiSubject from "./GsiSubject";

export default class GsiItemsSubject extends GsiSubject {
    public handleState(state: IDota2State | IDota2ObserverState): void {

    }
}
