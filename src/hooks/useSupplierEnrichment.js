import { useState, useEffect } from 'react';
import { supplierApi, extractArray } from '../services/api';

/**
 * Custom hook to enrich suppliers with their industry data
 * Replaces duplicate logic in Home.jsx and Listings.jsx
 * 
 * Usage:
 *   const enrichedSuppliers = useSupplierEnrichment(suppliers);
 */
export const useSupplierEnrichment = (suppliers = []) => {
  const [enrichedSuppliers, setEnrichedSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!suppliers || suppliers.length === 0) {
      setEnrichedSuppliers([]);
      return;
    }

    setIsLoading(true);
    let cancelled = false;

    (async () => {
      try {
        const enriched = await Promise.all(
          suppliers.map(async (supplier) => {
            try {
              const res = await supplierApi.getIndustries(supplier.id);
              const supplierIndustries = extractArray(res);
              return { ...supplier, industries: supplierIndustries };
            } catch {
              return { ...supplier, industries: supplier.industries || [] };
            }
          })
        );
        
        if (!cancelled) {
          setEnrichedSuppliers(enriched);
        }
      } catch {
        if (!cancelled) {
          setEnrichedSuppliers(suppliers);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [suppliers]);

  return { suppliers: enrichedSuppliers, isLoading };
};
