/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ElectricBastionlandItem extends Item {
    /**
     * Augment the basic Item data model with additional dynamic data.
     */
    prepareData () {
        super.prepareData();

        // Get the Item's data
        const itemData = this;
        const actorData = this.actor
            ? this.actor
            : {};
        const data = this.system;
    }
}
