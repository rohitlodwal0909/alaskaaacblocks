const db = require("../models");
const { FinishGood } = db;

exports.validateAndUpdateFinishGood = async (sizeList, quantityList) => {
  for (let i = 0; i < sizeList.length; i++) {
    const size = sizeList[i];
    const requiredQty = parseInt(quantityList[i], 10);

    // Get all Segregation entries (non-deleted)
    const segregations = await FinishGood.findAll({
      where: { deleted_at: null }
    });

    // Find entries with the matching size
    let totalOk = 0;
    const matchingEntries = [];

    for (const seg of segregations) {
      const sizes = JSON.parse(seg.size || "[]");
      const okPcs = JSON.parse(seg.no_of_ok_pcs || "[]");

      sizes.forEach((sz, idx) => {
        if (sz === size) {
          const pcs = parseInt(okPcs[idx] || 0);
          totalOk += pcs;

          matchingEntries.push({
            id: seg.id,
            index: idx,
            ok: pcs
          });
        }
      });
    }

    if (totalOk < requiredQty) {
      return {
        success: false,
        message: `Not enough OK pieces available for size ${size}. Required: ${requiredQty}, Available: ${totalOk}`
      };
    }

    // Deduct quantity from matching ok_pcs
    let qtyToDeduct = requiredQty;

    for (const entry of matchingEntries) {
      if (qtyToDeduct <= 0) break;

      const seg = await FinishGood.findByPk(entry.id);
      const sizes = JSON.parse(seg.size || "[]");
      const okPcs = JSON.parse(seg.no_of_ok_pcs || "[]");

      const currentVal = parseInt(okPcs[entry.index] || 0);
      const deduction = Math.min(currentVal, qtyToDeduct);

      // Deduct and update only this index
      okPcs[entry.index] = currentVal - deduction;
      qtyToDeduct -= deduction;

      // Clean entire okPcs array (remove nulls, stringify all numbers)
      const cleanedOkPcs = okPcs.map(pcs =>
        pcs === null || pcs === undefined || isNaN(pcs) ? "0" : String(pcs)
      );

      // ✅ Only update this record
      await seg.update({
        no_of_ok_pcs:cleanedOkPcs
      });
    }
  }

  return { success: true };
};



exports.updateSegregationOnDispatchEdit = async (sizeList, quantityList) => {
  for (let i = 0; i < sizeList.length; i++) {
    const size = sizeList[i];
    const diff = parseInt(quantityList[i]); // Ensure it's a number

    // Get all Segregation entries
    const segregations = await Segregation.findAll({
      where: { deleted_at: null }
    });

    const matchingEntries = [];
    let totalOk = 0;

    for (const seg of segregations) {
      const sizes = JSON.parse(seg.size || "[]");
      const okPcs = JSON.parse(seg.no_of_ok_pcs || "[]");

      sizes.forEach((sz, idx) => {
        if (sz === size) {
          const pcs = parseInt(okPcs[idx] || 0);
          totalOk += pcs;

          matchingEntries.push({
            id: seg.id,
            index: idx,
            ok: pcs
          });
        }
      });
    }

    // ✅ If diff > 0 → Deduct from segregation
    if (diff > 0) {
      if (totalOk < diff) {
        return {
          success: false,
          message: `Not enough OK pieces available for size ${size}. Required: ${diff}, Available: ${totalOk}`
        };
      }

      let qtyToDeduct = diff;

      for (const entry of matchingEntries) {
        if (qtyToDeduct <= 0) break;

        const seg = await Segregation.findByPk(entry.id);
        const okPcs = JSON.parse(seg.no_of_ok_pcs || "[]");
        const currentVal = parseInt(okPcs[entry.index] || 0);

        const deduction = Math.min(currentVal, qtyToDeduct);
        okPcs[entry.index] = currentVal - deduction;
        qtyToDeduct -= deduction;

        const cleanedOkPcs = okPcs.map(pcs =>
          pcs === null || pcs === undefined || isNaN(pcs) ? "0" : String(pcs)
        );

        await seg.update({ no_of_ok_pcs: cleanedOkPcs });
      }
    }

    // ✅ If diff < 0 → Add back to segregation
    else if (diff < 0) {
      let qtyToAdd = Math.abs(diff);

      // Distribute qty across matching entries equally or just add to first (simple logic)
      for (const entry of matchingEntries) {
        if (qtyToAdd <= 0) break;

        const seg = await Segregation.findByPk(entry.id);
        const okPcs = JSON.parse(seg.no_of_ok_pcs || "[]");

        const currentVal = parseInt(okPcs[entry.index] || 0);
        const addition = qtyToAdd; // all at once or distribute if needed
        okPcs[entry.index] = currentVal + addition;
        qtyToAdd -= addition;

        const cleanedOkPcs = okPcs.map(pcs =>
          pcs === null || pcs === undefined || isNaN(pcs) ? "0" : String(pcs)
        );

        await seg.update({ no_of_ok_pcs: cleanedOkPcs });

        // If you're distributing across multiple entries, use break here for single update
        break;
      }
    }
  }

  return { success: true };
};

