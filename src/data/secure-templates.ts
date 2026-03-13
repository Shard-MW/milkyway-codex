import type { SecureTemplate } from '../types/api.types.ts'

export const SECURE_TEMPLATES: SecureTemplate[] = [
  {
    name: 'Attribute Names',
    description: 'These formats describe the creation of common attribute names.',
    attributes: [
    ],
    examples: [
    ],
  },
  {
    name: 'Modified Attributes',
    description: 'When the secure template system looks for a modified attribute of name, it will seek out one of the following forms (see Chapter 17 for details):',
    attributes: [
    ],
    examples: [
      { title: 'Example', code: `alt-unit2*type-B1`, language: 'lua' },
    ],
  },
  {
    name: 'Attribute Values',
    description: 'These rules describe the construction of attribute values.',
    attributes: [
    ],
    examples: [
    ],
  },
  {
    name: 'State Attributes (Chapter 25)',
    description: 'Pick among values based on the current state.',
    attributes: [
    ],
    examples: [
      { title: 'Example', code: `1:value1;2-4:value2;5:;default`, language: 'lua' },
    ],
  },
  {
    name: 'Transition Rules (Chapter 25)',
    description: 'These rules (usually values in a State Attribute) tell a header what state to enter.',
    attributes: [
    ],
    examples: [
      { title: 'Example', code: `3-2state1,state2,state3push() 5-1`, language: 'lua' },
    ],
  },
  {
    name: 'State Lists',
    description: 'State lists evaluate to true if the header\'s state fits all of the listed rules',
    attributes: [
    ],
    examples: [
      { title: 'Example', code: `0-1,3!2-4;1-10`, language: 'lua' },
    ],
  },
  {
    name: 'Boolean',
    description: 'Boolean attributes generally follow the same rules as boolean values in Lua: everything but false or nil is considered logically false. Sometimes for attributes, though, evaluating to an empty strings is interpreted as false. See Chapters 17, 25 & 26.',
    attributes: [
    ],
    examples: [
    ],
  },
  {
    name: 'SecureActionButtonTemplate',
    description: 'All of the attributes listed on this page are modified attributes.',
    attributes: [
      { name: 'type', values: ['See below'], description: 'Determines the type of action to take when clicked.' },
      { name: 'unit', values: ['unitID'], description: 'Controls the target of the action.' },
      { name: 'unitsuffix', values: ['target[target]… pet[target]…'], description: 'Alternative to unit, this attribute\'s value is appended to the parent frame\'s unit and used as if it were the unit attribute.' },
      { name: 'helpbutton', values: ['string'], description: 'Specifies a suffix to be used by the modified attribute system when the current unit is friendly.' },
      { name: 'harmbutton', values: ['string'], description: 'Like helpbutton but for hostile units. If harmbutton is chosen, helpbutton will be ignored.' },
      { name: 'target-bag', values: ['bagID'], description: 'Used with target-slot to specify the target of an item-targetable spell (e.g. an enchantment).' },
      { name: 'target-slot', values: ['inventory slot bag slot'], description: 'Used alone to specify an inventory slot, or with target-bag to specify an item in your bags.' },
      { name: 'target-item', values: ['name'], description: 'Specifies a target item by name.' },
      { name: 'checkselfcast', values: ['boolean'], description: 'Causes the unit to respect your self-cast modifier key settings.' },
    ],
    examples: [
    ],
  },
  {
    name: 'type Attribute Values',
    description: 'Following are the possible values for the type attribute including any subordinate attributes the types use. If a type is marked with (U), it can optionally use the unit/unitsuffix attributes to direct its action.',
    attributes: [
      { name: 'spell (U)\nCast a spell', values: ['spell'], description: 'Specifies the spell name' },
      { name: 'item (U)\nUse an item', values: ['item'], description: 'Tells which item to use' },
      { name: 'macro\nRun a macro', values: ['macro'], description: 'Picks the macro to run' },
      { name: 'macrotext', values: ['string'], description: 'Runs the given text as a macro' },
      { name: 'action (U)\nUse an action slot', values: ['action'], description: 'Uses the specified action slot' },
      { name: 'actionpage', values: ['page'], description: 'Uses an action based on the action bar page and the button\'s ID' },
      { name: 'pet (U)\nCast a pet action', values: ['action'], description: 'Casts the given pet action' },
      { name: 'actionbar\nChange action bar pages', values: ['action'], description: 'Advance up or down one page' },
      { name: 'page', values: [], description: 'Switch directly to a page' },
      { name: 'one, other', values: [], description: 'Swap between one and other' },
      { name: 'target\nSet your target', values: ['unit'], description: '—' },
      { name: 'focus\nSet your focus', values: ['unit'], description: '—' },
      { name: 'assist\nAssist a unit', values: ['unit'], description: '—' },
      { name: 'maintank / mainassist\nSets the given role on a unit', values: ['action'], description: 'How to apply the role to the unit' },
      { name: 'unit', values: ['See above'], description: '' },
      { name: 'stop\nStop a spell cast in progress', values: ['—'], description: '—' },
      { name: 'click\nSimulate a  click on another button', values: ['clickbutton'], description: 'The button to click' },
      { name: 'attribute\nSet an attribute on a frame', values: ['attribute-frame'], description: 'The frame on which to set the attribute' },
      { name: 'attribute-name', values: ['string'], description: 'The name of the attribute to set' },
      { name: 'attribute-value', values: ['any'], description: 'The value to set on the attribute' },
      { name: 'function(frame, unit, button)', values: [], description: 'If the type attribute is set to a function, it will be called with the parameters shown here' },
    ],
    examples: [
    ],
  },
  {
    name: 'Header Attributes',
    description: 'These are attributes you set on the header to control its behavior. See below for attributes that apply to the header\'s children.',
    attributes: [
      { name: 'state', values: ['state'], description: 'The current state of the header. Setting this attribute causes all of the following attributes to be re-evaluated and take their desired effect.' },
      { name: 'exportstate', values: ['Boolean'], description: 'If true, the header\'s state will be exported to its children through a state-parent attribute.' },
      { name: 'addchild', values: ['frame'], description: 'Set this attribute on the header for each child frame that should be managed by the state header. Alternatively you can use the stateheader attribute on the child.' },
      { name: 'headwidth (S)', values: ['number'], description: 'Sets the width of the header' },
      { name: 'headheight (S)', values: ['number'], description: 'Sets the height of the header' },
      { name: 'headscale (S)', values: ['number'], description: 'Sets the header\'s scale' },
      { name: 'headparent (S)', values: ['frame'], description: 'Re-parents the header' },
      { name: 'headofsx (S)', values: ['number'], description: 'Sets the header\'s anchor x offset' },
      { name: 'headofsy (S)', values: ['number'], description: 'Sets the header\'s anchor y offset' },
      { name: 'headofspoint (S)', values: ['string'], description: 'Sets the header\'s anchor point (requires either headofsx or headofsy)' },
      { name: 'headofsrelpoint (S)', values: ['string'], description: 'Sets the header\'s anchor relative point (requires either headofsx or headofsy)' },
      { name: 'raise (S)', values: ['Boolean'], description: 'If true, the header\'s frame level will be raised above its parent' },
      { name: 'state-name', values: ['state'], description: 'Specific states are set on the header by various sources. statemap attributes then translate these to produce the final state attribute on the header. Some common names are:\n\nparent - set by a parent header\nanchor - set by an anchor template\nunitwatch - set by the RegisterUnitWatch driver\nvisibility - set by RegisterStateDriver when configured to use visibility' },
      { name: 'statemap-name[-value] (S)', values: ['Transition'], description: 'Maps state-name changes to a transition rule that is applied to the header. If value is omitted, the map responds to any change in state-name. Otherwise, the map applies specifically to changes to the given value. If multiple statemap-name attributes are used, the more specific ones are chosen first.' },
      { name: 'delaystatemap-name[-value] (S)', values: ['Transition'], description: 'Similar to statemap-name, the transition chosen occurs after a number of seconds.' },
      { name: 'delaytimemap-name[-value] (S)', values: ['number'], description: 'Specifies the number of seconds for delaystatemap-name.' },
      { name: 'delayhovermap-name[-value] (S)', values: ['Boolean'], description: 'If true, the delayed state change will wait until the mouse cursor is no longer over the header or any of its children.' },
      { name: 'headstateunit (S)', values: ['unit ID'], description: 'This attribute sets the unit on the header based on the current state. This is an alternative to using several modified unit attributes.' },
    ],
    examples: [
    ],
  },
  {
    name: 'Child Attributes',
    description: 'These are attributes you set on state header children to control their interactions with the header. Any state attributes shown here work off the state of the header.',
    attributes: [
      { name: 'stateheader', values: ['frame'], description: 'An alternative to using addchild on the header, the child will use the specified frame to determine its state-controlled action. All state-controlled visual properties, keybindings, etc. will be ignored.' },
      { name: 'statebutton (S, M)', values: ['string'], description: 'Specifies the suffix to be used by modified attributes when the child is clicked.' },
      { name: 'statedownbutton (S, M)', values: ['string'], description: 'Like statebutton but only applies to clicks triggered by mouse-down. If you use both statebutton and statedownbutton on a frame that\'s registered for both up and down clicks, you can perform two actions on each key press.' },
      { name: 'showstates', values: ['State List'], description: 'Specifies in which states to show the child. The child will be hidden otherwise.' },
      { name: 'hidestates', values: ['State List'], description: 'Specifies in which states to hide the child. The child will be shown otherwise. If showstates is specified, hidestates will be ignored.' },
      { name: 'statehidden', values: ['Boolean'], description: 'When the child is hidden via showstates or hidestates, this attribute will be true, differentiating a state-triggered hide from a “manual” hide.' },
      { name: 'width (S)', values: ['number'], description: 'Sets the width of the child' },
      { name: 'height (S)', values: ['number'], description: 'Sets the height of the child' },
      { name: 'scale (S)', values: ['number'], description: 'Sets the child\'s scale' },
      { name: 'ofsx (S)', values: ['number'], description: 'Sets the child\'s anchor x offset relative to the header' },
      { name: 'ofsy (S)', values: ['number'], description: 'Sets the child\'s anchor y offset relative to the header' },
      { name: 'ofspoint (S)', values: ['string'], description: 'Sets the child\'s anchor point' },
      { name: 'ofsrelpoint (S)', values: ['string'], description: 'Sets the relative point on the header for the child\'s anchor' },
      { name: 'newstate (S, M)', values: ['Transition'], description: 'Applies the chosen transition rule to the header when the child is clicked' },
      { name: 'delaystate (S, M)', values: ['Transition'], description: 'Applies the chosen transition rule to the header after a given delay' },
      { name: 'delaytime (S, M)', values: ['number'], description: 'Sets the delay (in seconds) used by delaystate' },
      { name: 'delayhover (S, M)', values: ['Boolean'], description: 'If this evaluates to true, the delayed state change timer will wait until the mouse is no longer over the header or any of its children.' },
      { name: 'statebindings (S)', values: ['string'], description: 'Chooses a binding set name for the current state' },
      { name: 'bindings-set', values: ['string'], description: 'Binds one or more keys to the child when the given set is chosen. This attribute should take the following form:\n[*]KEY[:suffix][;[[*]KEY[:suffix]]]...\nKEY is the key to bind and suffix will be used for any modified attributes. An asterisk (*) indicates the binding takes priority over any other statebindings claiming the given key. Example:\nNUMPAD8:normal;ALT-NUMPAD8:alt\nThis would bind both NUMPAD8 and ALT-NUMPAD8 to the child, sending normal as a suffix most of the time and alt as the suffix when activated with the alt key.' },
    ],
    examples: [
    ],
  },
  {
    name: 'Anchor Templates',
    description: 'All of the following attributes are modified.',
    attributes: [
      { name: 'anchorchild', values: ['frame $parent'], description: 'Specifies the frame that will be controlled by this anchor' },
      { name: 'childofsx', values: ['number'], description: 'Sets the anchor x offset for the child relative to the anchor frame' },
      { name: 'childofsy', values: ['number'], description: 'Sets the anchor y offset for the child relative to the anchor frame' },
      { name: 'childpoint', values: ['string'], description: 'Sets the child\'s anchor point' },
      { name: 'childrelpoint', values: ['string'], description: 'Sets the relative point to which the child will be anchored' },
      { name: 'childreparent', values: ['Boolean'], description: 'If true, the child frame will be “physically” re-parented to the anchor frame' },
      { name: 'childraise', values: ['Boolean'], description: 'If true, the anchor will call child:Raise()' },
      { name: 'childstate', values: ['[^]state'], description: 'If set, the state-anchor attribute on the child will be set to the given value. Adding a carat (^) to the beginning forces the state change even if the child is already in that state.' },
      { name: 'childverify', values: ['Boolean'], description: 'If true, the child must be a “physical” child of the anchor frame in order for childstate to have any effect.' },
      { name: 'onclickbutton', values: ['string'], description: 'Sets the suffix used by any modified attributes on the anchor.  By default the suffix is the actual mouse button used to click the anchor.' },
      { name: 'onenterbutton', values: ['string'], description: 'Sets the modified attribute suffix used when the mouse enters the anchor. Default: onenter' },
      { name: 'onleavebutton', values: ['string'], description: 'Sets the modified attribute suffix used when the mouse leaves the anchor. Default: onleave' },
      { name: 'onmouseupbutton', values: ['string'], description: 'Sets the modified attribute suffix used when the mouse is clicked down on the anchor. Default is the actual mouse button.' },
      { name: 'onmousedownbutton', values: ['string'], description: 'Sets the modified attribute suffix used when the mouse is released from  the anchor. Default is the actual mouse button.' },
    ],
    examples: [
    ],
  },
  {
    name: 'Group Headers',
    description: '',
    attributes: [
      { name: 'template', values: ['string'], description: 'The name of an XML template to use when creating new frames.' },
      { name: 'templateType', values: ['string'], description: 'The frame type of the XML template being used (Button, StatusBar, etc.).' },
      { name: 'point', values: ['string'], description: 'A valid XML anchor point. This point will be used to anchor a new frame to an existing frame. The code will intelligently use the opposing anchor points, so if you specify TOP, it will anchor the TOP point of the new frame to the BOTTOM point of the previous frame.' },
      { name: 'xOffset', values: ['number'], description: 'An x offset (in pixels) to be used when anchoring new frames.' },
      { name: 'yOffset', values: ['number'], description: 'A y offset (in pixels) to be used when anchoring new frames.' },
      { name: 'maxColumns', values: ['number'], description: 'The maximum number of columns that the        header will create. Default is 1.' },
      { name: 'unitsPerColumn', values: ['number'], description: 'The maximum number of units that will be displayed in a single column. When this value is nil, there is no limit.' },
      { name: 'startingIndex', values: ['number'], description: 'The index in the final sorted list at which to start displaying units. Default is 1.' },
      { name: 'columnSpacing', values: ['number'], description: 'The amount of space (in pixels) between the columns. Default is 0.' },
      { name: 'columnAnchorPoint', values: ['string'], description: 'The anchor point for each new column. A value of LEFT will cause the columns to grow to the right.' },
      { name: 'initial-anchor', values: ['string'], description: 'The initial anchor point for new unit frames. This can be used to place the frame in a different starting location (such as growing from the bottom up instead of top down). This value should be a comma-separated list containing anchor point, relative anchor point, x offset and y offset.' },
      { name: 'initial-width', values: ['number'], description: 'The initial width of the unit frames in pixels.' },
      { name: 'initial-height', values: ['number'], description: 'The initial height of the unit frame in pixels.' },
      { name: 'initial-scale', values: ['number'], description: 'The initial scale of the unit frame.' },
      { name: 'showRaid', values: ['Boolean'], description: 'When true, the group header is shown when the player is in a raid.' },
      { name: 'showParty', values: ['Boolean'], description: 'When true, the group header is shown when the player is in a party. This attribute doesn’t imply showRaid but can work alongside it.' },
      { name: 'showPlayer', values: ['Boolean'], description: 'When true, the header includes the player when not in a raid (normally, the player would not be visible in a party listing).' },
      { name: 'showSolo', values: ['Boolean'], description: 'When true, the header is shown when the player is not in any group. This option implies showPlayer.' },
      { name: 'nameList', values: ['string'], description: 'A comma-separated list of player names to be included in the listing. This option is not used if groupFilter is specified.' },
      { name: 'groupFilter', values: ['filter[', 'filter]...'], description: 'Selects group members based on specific filters. Each filter can be one of:\n\nRaid group number\nEnglish class name\nRaid role (MAINTANK or MAINASSIST)\n\nUnless strictFiltering is set, a unit only needs to match one of the filters in the list to be included.' },
      { name: 'strictFiltering', values: ['Boolean'], description: 'If true,  a unit must pass all filters to be included.' },
      { name: 'groupBy', values: ['GROUP CLASS ROLE'], description: 'Groups the unit frames by the specified category' },
      { name: 'groupingOrder', values: ['groupNum[', 'groupNum]... CLASS[', 'CLASS]... ROLE[', 'ROLE]...'], description: 'Specifies the order in which the groups appear. The values you use here should match the groupBy type.' },
      { name: 'sortMethod', values: ['NAME INDEX'], description: 'Determines how the members are sorted within a group, either by character name or by raid index.' },
      { name: 'sortDir', values: ['ASC DESC'], description: 'Sets the sort direction for members within a group. Default is ASC.' },
      { name: 'useOwnerUnit', values: ['Boolean'], description: 'When true, the unit attribute on the created frames corresponds to the owner’s unit instead of the pet’s unit.' },
      { name: 'filterOnPet', values: ['Boolean'], description: 'When true, the pets’ names are used when sorting and filtering.' },
    ],
    examples: [
    ],
  },
  {
    name: 'SecurePieButtonTemplate',
    description: '',
    attributes: [
      { name: 'piecount (S)', values: ['number'], description: 'Number of segments' },
      { name: 'piemindist (S)', values: ['number'], description: '"Dead zone" radius' },
      { name: 'piegap (S)', values: ['number'], description: 'Degrees between segments' },
      { name: 'pieoffset (S)', values: ['number'], description: 'Degrees rotated from segment 1 being centered at the top' },
      { name: 'pievariation (S)', values: ['string'], description: 'Picks a variation based on the current state' },
      { name: 'pie[variation]<segment>child (M)', values: ['frame'], description: 'Assigns a protected frame to which clicks will be sent\nsegment can be: <segment number> | none | *' },
      { name: 'pie[variation]<segment>button (M)', values: ['string'], description: 'Sets a mouse button or virtual state button to be used for the click\nsegment can be: <segment number> | none | *' },
    ],
    examples: [
    ],
  },
]

export const SECURE_TEMPLATES_MAP = new Map<string, SecureTemplate>(
  SECURE_TEMPLATES.map((t) => [t.name, t])
)
