/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ElectricBastionlandActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions () {
        return mergeObject(super.defaultOptions, {
            classes: [
                "electricbastionland",
                "sheet",
                "actor"
            ],
            template: "systems/electricbastionland/templates/actor/actor-sheet.html",
            width: 500,
            height: 600,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "description",
                },
            ],
        });
    }

    /* -------------------------------------------- */
    /** @override */
    getData () {
        const context = super.getData();
        context.systemData = context.data.data;

        return context;
    }

    /** @override */
    activateListeners (html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if ( !this.options.editable ) return;

        // Handle rollable items and attributes
        html.find(".rollable").on("click", this._onItemRoll.bind(this));

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item")[0];
            const item = this.actor.items.get(li.dataset.itemId);
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item")[0];
            this.actor.deleteEmbeddedDocuments("Item", [li.dataset.itemId]);
        });

        html.find(".item-create").click(this._onItemCreate.bind(this));

        // Add draggable for macros.
        html.find(".attributes a.attribute-roll").each((i, a) => {
            a.setAttribute("draggable", true);
            a.addEventListener("dragstart", ev => {
                let dragData = ev.currentTarget.dataset;
                ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
            }, false);
        });

        // Rest restores HP
        html.find('.rest')
            .click(async ev => {
                // Someone DEPRIVED of a crucial need (e.g.
                // food,water or warmth) cannot benefit from RESTS
                if (!this.actor.data.data.deprived) {
                    await this.actor.update({'data.hp.value': this.actor.data.data.hp.max});
                }
            });

        html.find('.restore')
            .click(async ev => {
                await this.actor.update({'data.abilities.STR.value': this.actor.data.data.abilities.STR.max});
                await this.actor.update({'data.abilities.DEX.value': this.actor.data.data.abilities.DEX.max});
                await this.actor.update({'data.abilities.CHA.value': this.actor.data.data.abilities.CHA.max});
            });

        html.find('.luck')
            .click(ev => {
                let roll = new Roll('1d6');
                roll.roll();
            });
    }

    /* -------------------------------------------- */

    /**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event   The originating click event
     * @private
     */
    _onItemCreate (event) {
        event.preventDefault();
        const header = event.currentTarget;
        // Get the type of item to create.
        const type = header.dataset.type;
        // Grab any data associated with this control.
        const data = duplicate(header.dataset);
        // Initialize a default name.
        const name = `New ${type.capitalize()}`;
        // Prepare the item object.
        const itemData = {
            name: name,
            type: type,
            data: data,
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.data["type"];

        // Finally, create the item!
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    _onItemRoll (event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        if (dataset.roll) {
            let roll = new Roll(dataset.roll, this.actor.data.data);
            let label = dataset.label ? `Rolling ${dataset.label}` : '';
            roll.roll({ async: false });

            roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: this.actor}),
                flavor: label,
            });
        }
    }

}
