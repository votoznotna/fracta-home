<template>
    <section v-if="!loading" class="ctrlButtons">
        <button v-for="button in ctrlButtons" 
            :class="[button.id, (selectedButtonId === button.id) ? 'active' : '']" 
            @click="() => onButtonClick(button.id)" 
            :key="button.id">{{button.text}}
        </button>
        <div :class='randomYearValueClass'>{{randomYearValue}}</div>
        <div :class='colorValueClass'>
            <ul>
                <li v-for="selectedGroup in selectedGroupContent" :key="`group_${selectedGroup.value}`">
                    <div class="groupColor" :style="{ backgroundColor: selectedGroup.color }"></div>
                    <label class="groupValue">{{selectedGroup.value}}</label>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import api, {getPipeDataByGroupName, getPipeDataByGroupNameAndValue, resetPipeData, getRandomYearFromRange, getGroupContentByName} from "@/services/MapService";

export default {
    name: "Controls",

    data() {
        return {
            selectedButtonId: 'default',
            selectedGroupContent: [],
            ctrlButtons: [
                    { id: 'default', text: 'Default'},
                    { id: 'year', text: 'Year'},
                    { id: 'diameter', text: 'Diameter'},
                    { id: 'material', text: 'Material'},
                    { id: 'randomYear', text: 'Random Year'}
                ],
            randomYearValue: ''
        }
    },
    methods: {
        ...mapActions('maps',['updateMap']),
        onButtonClick(id) {
            this.selectedButtonId = id;
            if(id === 'default') {
                api.updateMapSource(this.map, resetPipeData(this.pipes));
            } else if (id === 'randomYear'){
                this.randomYearValue = getRandomYearFromRange();
                api.updateMapSource(this.map, resetPipeData(this.pipes));
                api.updateMapSource(this.map, getPipeDataByGroupNameAndValue('year', this.pipes, this.groups, this.randomYearValue));
            } else {
                api.updateMapSource(this.map, getPipeDataByGroupName(id, this.pipes, this.groups));
                this.selectedGroupContent = getGroupContentByName(id, this.groups);
            }
        }
    },
    computed: {
        ...mapGetters('maps', ['map', 'loading','pipes', 'groups']),
        randomYearValueClass() {
            return `randomYearValueClass ${this.selectedButtonId === 'randomYear' ? '' : 'hide'}`;
        },
        colorValueClass() {
            return `colorValueClass ${['randomYear', 'default'].indexOf(this.selectedButtonId) > -1 ? 'hide' : ''}`;
        }
    }
};
</script>

<style lang="scss" scoped>
.ctrlButtons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:"a b"
                        "c d"
                        "e e"
                        "f f";
    grid-gap: 5px;
    padding: 5px;
    position: absolute;
    border-radius: 3px;
    align-items: center;
    z-index: 10;
    top: 0;
    left: 0;
    margin: 5px;
    outline: none;
    button {
        border-radius: 100px;
        cursor: pointer;
        color: white;
        font-weight: 600;
        font-size: 1rem;
        padding: 10px;
        outline: none;
        border: none;
        background-color: green;
        &:active, &:focus {
            background: blue;
        }
        &.active {
            background: blue;
            color: white;
        }
        &.default {
            grid-area: a;
        }
        &.year {
            grid-area: b;
        }
        &.diameter {
            grid-area: c;
        }
        &.material {
            grid-area: d;
        }
        &.randomYear {
            grid-area: e;
        }
    }
    .randomYearValueClass, .colorValueClass  {
        grid-area: f;
        font-size: 0.9rem;
        font-weight: 600;
        background-color: white;
        display: flex;
        border-radius: 30px;
        color: gray;
        border-color: white;
        justify-content: center;
        align-items: center;
        padding: 10px;
        /* height: 100%; */
        border: 1px solid gray;
    }
    .colorValueClass {
        ul {
            list-style: none;
            margin: 2px;
            padding: 0;
            li {
                display: flex;
                justify-content: stretch;
                align-items: center;
                list-style-type: none;
                margin: 3px;
                .groupColor{
                    margin-right: 5px;
                    height: 0.8rem;
                    width: 3rem;
                    border: 1px solid gray;
                }
            }
        }
    }
    .hide {
        display: none;
    }
}
</style>