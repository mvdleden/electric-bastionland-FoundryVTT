/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ElectricBastionlandActor extends Actor {
    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData () {
        super.prepareData();
        this.data.data.groups = this.data.data.groups || {};
        this.data.data.attributes = this.data.data.attributes || {};

        if (this.data.type === 'character') this._prepareCharacterData(this.data);
    }

    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData (actorData) {
        const data = actorData.data;

        // sum all armour for equipped items
        data.armour = actorData
            .items
            .map(
                item => item.data.data.equipped ? item.data.data.armour : 0
            )
            .reduce(
                (a, b) => a + b, 0
            )

        // check if more than two items are bulky
        data.tooBulky = actorData
            .items
            .filter(
                item => item.data.data.bulky
            )
            .length > 2;

        if (data.tooBulky) {
            data.hp.value = 0;
        }

    }

    /** @override */
    getRollData () {
        return super.getRollData();
    }

    /** @override */
    deleteOwnedItem (itemId) {
        const item = this.getOwnedItem(itemId);

        if (item.data.data.quantity > 1) {
            item.data.data.quantity--;
        } else {
            super.deleteOwnedItem(itemId);
        }
    }
}
