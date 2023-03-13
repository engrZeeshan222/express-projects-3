
const positions = {
    inlineafter: 1,
    nextline: 2,
    inlinewordafter: 3,
    inlinedateafter: 4
}

const searchTerms = [
    { rbField: 'Fiscaalgemak_betalingskenmerk_ob', term: 'Betalingskenmerk', type: 'reference', pos: positions.inlineafter , value :"" }, 
    { rbField: 'Fiscaalgemak_verschuldigdbedrag_ob', term: 'Te betalen omzetbelasting deze periode', type: 'amount', pos: positions.inlineafter , value :""},
    // { rbField: 'Fiscaalgemak_vervaldatum_betaling_ob', term: 'te betalen vóór', type:'date', pos: positions.inlinedateafter, value :""}
    // { rbField: 'Fiscaalgemak_vervaldatum_betaling_ob12', term: 'te betalen vóór', type:'date', pos: positions.inlinedateafter}
]


exports.positions = positions;
exports.searchTerms = searchTerms;
