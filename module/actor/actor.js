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
        this.system.groups = this.system.groups || {};
        this.system.attributes = this.system.attributes || {};

        if (this.type === 'character') this._prepareCharacterData();
    }

    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData () {
        const data = this.system;

        // sum all armour for equipped items
        data.armour = this.items
            .map(
                item => item.system.equipped ? item.system.armour : 0
            )
            .reduce(
                (a, b) => a + b, 0
            )

        // check if more than two items are bulky
        data.tooBulky = this.items
            .filter(
                item => item.system.bulky
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
}
