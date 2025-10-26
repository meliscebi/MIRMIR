import { SuiClient } from "@mysten/sui/client";
import { USERNAME_REGISTRY_ID } from "./constants";

/**
 * Resolve a username to its Linktree NFT object ID
 * Uses the on-chain UsernameRegistry with DynamicField mapping
 */
export async function resolveUsernameToNFT(
  client: SuiClient,
  username: string
): Promise<string | null> {
  try {
    console.log(`[UsernameResolver] Resolving username: "${username}"`);
    console.log(`[UsernameResolver] Registry ID: ${USERNAME_REGISTRY_ID}`);
    
    // Fetch the UsernameRegistry object
    const registryData = await client.getObject({
      id: USERNAME_REGISTRY_ID,
      options: {
        showContent: true,
      },
    });

    console.log(`[UsernameResolver] Registry data:`, registryData);

    if (!registryData.data || !("content" in registryData.data)) {
      console.error("[UsernameResolver] UsernameRegistry not found or invalid");
      return null;
    }

    const content = registryData.data.content as any;
    if (content.dataType !== "moveObject") {
      console.error("[UsernameResolver] Invalid registry object type:", content.dataType);
      return null;
    }

    const fields = content.fields as any;
    if (!fields || !fields.username_to_nft) {
      console.error("[UsernameResolver] Registry fields not found", { fields: Object.keys(fields || {}) });
      return null;
    }

    console.log("[UsernameResolver] username_to_nft field:", fields.username_to_nft);

    // The username_to_nft is a Table, query it using getDynamicFieldObject
    const tableId = fields.username_to_nft.id?.id || fields.username_to_nft.fields?.id?.id;
    if (!tableId) {
      console.error("[UsernameResolver] Cannot extract Table ID from username_to_nft", fields.username_to_nft);
      return null;
    }
    console.log(`[UsernameResolver] Table ID: ${tableId}`);

    try {
      const tableData = await client.getDynamicFieldObject({
        parentId: tableId,
        name: {
          type: "0x1::string::String",
          value: username,
        },
      });

      console.log(`[UsernameResolver] Table data for "${username}":`, tableData);

      if (!tableData.data) {
        console.warn(`[UsernameResolver] Username "${username}" not found in registry`);
        return null;
      }

      // Extract the NFT object ID from the dynamic field
      const tableContent = tableData.data.content as any;
      if (tableContent.dataType === "moveObject") {
        const tableFields = tableContent.fields as any;
        if (tableFields && tableFields.value) {
          console.log(`[UsernameResolver] Found NFT ID for "${username}":`, tableFields.value);
          return tableFields.value;
        }
      }

      return null;
    } catch (error) {
      console.warn(`[UsernameResolver] Error querying username "${username}":`, error);
      return null;
    }
  } catch (error) {
    console.error("[UsernameResolver] Error resolving username:", error);
    return null;
  }
}

/**
 * Check if a string is a valid username (not an object ID)
 */
export function isUsername(identifier: string): boolean {
  // Check if it's a valid Sui object ID (0x followed by hex)
  if (identifier.match(/^0x[a-fA-F0-9]{63,}$/)) {
    return false; // It's an object ID
  }
  
  // Check if it looks like a username (alphanumeric, underscores, 3+ chars)
  if (identifier.match(/^[a-zA-Z0-9_]{3,}$/)) {
    return true; // It's a valid username format
  }

  return false;
}