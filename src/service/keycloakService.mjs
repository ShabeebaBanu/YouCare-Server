import axios from "axios";
import 'dotenv/config';
import KeycloakErrorException from "../exceptions/KeycloakErrorException.mjs";
import jwt from "jsonwebtoken";

export async function getAdminToken() {
    const params = new URLSearchParams();

    params.append("client_id", process.env.KEYCLOAK_ADMIN_CLIENT_ID);
    params.append("username", process.env.KEYCLOAK_ADMIN_USERNAME);
    params.append("password", process.env.KEYCLOAK_ADMIN_PASSWORD);
    params.append("grant_type", "password");

    const response = await axios.post(
        `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, 
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
    );
    
    return response.data.access_token;
};


export async function createUser(userData, role) {

    const adminToken = await getAdminToken();
    try {
       const response = await axios.post(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status == 201) {
            const location = response.headers.location;
            const userId = location.substring(location.lastIndexOf("/") + 1);

            const roleResponse = await getClientRoleDetailWithRoleName(role);
            const rolePayload = {
                id : roleResponse.id,
                name: roleResponse.name
            }
            const roleAssignResponse = await AssignRole(userId, rolePayload);

            if (roleAssignResponse.success) {
                return { success: true, message: "User created and role assigned successfully", data: userId };
            }
        }

        return { success: false, message: "User created and role assignment failed", data: null};

    } catch (error) {
        throw new KeycloakErrorException(error.response.data.errorMessage);
    }
};

export async function getClientRoleDetailWithRoleName(roleName) {
    const adminToken = await getAdminToken();

    // const clientRes = await axios.get(
    //     `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/clients?clientId=${process.env.KEYCLOAK_CLIENT}`,
    //     { 
    //         headers: { 
    //             Authorization: `Bearer ${adminToken}` 
    //         } 
    //     }
    // );
    // const clientUUID = clientRes.data[0].id;

   
    const roleRes = await axios.get(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/clients/${process.env.KEYCLOAK_CLIENT_ID}/roles/${roleName}`,
        { 
            headers: { 
                Authorization: `Bearer ${adminToken}` 
            } 
        }
    );

    return roleRes.data;
}


export async function AssignRole(userId, rolePayload) {
    const adminToken = await getAdminToken();

    // const clientRes = await axios.get(
    //     `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/clients?clientId=${process.env.KEYCLOAK_CLIENT}`,
    //     { headers: { Authorization: `Bearer ${adminToken}` } }
    // );
    // const clientUUID = clientRes.data[0].id;

    // const roleRes = await axios.get(
    //     `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/clients/${clientUUID}/roles/${roleName}`,
    //     { headers: { Authorization: `Bearer ${adminToken}` } }
    // );

    // const role = roleRes.data;
    try {
        await axios.post(
            `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/role-mappings/clients/${process.env.KEYCLOAK_CLIENT_ID}`,
            [rolePayload],
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );

        return { success: true, message: "Client role assigned successfully", userId };
    } catch (error) {
        throw new KeycloakErrorException(error.response.data.errorMessage);
    }
    
}


export async function isEmailAlreadyRegistered(email) {

    const adminToken = await getAdminToken();

    try {
        const response = await axios.get(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
              {
                headers: { Authorization: `Bearer ${adminToken}` },
                params: { email }
              }
        );
        return response.data.length > 0;

    } catch (error) {
        throw new KeycloakErrorException(error.response.data.errorMessage);
    }   
};

export async function getUserDetailsByEmail(email) {

    const adminToken = await getAdminToken();

    try {
        const response = await axios.get(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
              {
                headers: { Authorization: `Bearer ${adminToken}` },
                params: { email }
              }
        );
        return response.data;

    } catch (error) {
        throw new KeycloakErrorException(error.response.data.errorMessage);
    }   
};

export async function extractUserRole(token) {
    try {
        const decoded = jwt.decode(token, {complete: true});
        if (!decoded) {
            return { success: false, message: "Invalid Token, Unabel to Decode Token", data: null};
        }

        const clientId = process.env.KEYCLOAK_CLIENT;
        const realmRoles = decoded.payload?.resource_access?.[clientId]?.roles || [];
        if (!realmRoles) {
            return { success: false, message: "User Role Data Not Found", data: null};
        }
    
        return { success: true, message:"Role Fetched Successfully", data: realmRoles};
    } catch(error) {
        throw new Error(error.message);
    }
};

export async function extractToken(request) {
    console.log("request: ", request);
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      return { success: false, message: "Missing Authorization header"};
    }
    
    const token = authHeader.split(" ")[1];
    return token;
};

export async function getUserDetailsByUserId(userId) {
    const adminToken = await getAdminToken();

    try {
        const response = await axios.get(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
              {
                headers: { Authorization: `Bearer ${adminToken}` }
              }
        );
        return response.data;

    } catch (error) {
        throw new KeycloakErrorException(error.response.data.errorMessage);
    } 
};

export async function updateUserDetailsByUserId(userId, updatedData) {
    const adminToken = await getAdminToken();

    try {
        const response = await axios.put(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
        updatedData,
              {
                headers: { Authorization: `Bearer ${adminToken}` }
              }
        );
    
        return response.data;

    } catch (error) {
        throw new KeycloakErrorException(error.response.data.errorMessage);
    } 
};

export async function resetUserPassword(userId, newPassword) {
  const adminToken = await getAdminToken();

  try {
    const response = await axios.put(
      `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/reset-password`,
      {
        type: "password",
        value: newPassword,
        temporary: false,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    if (response.status === 204) {
      return { success: true, message: "Password updated successfully" };
    } else {
      return { success: false, status: response.status, message: "Unexpected response status" };
    }
  } catch (error) {
    throw new KeycloakErrorException(error.response?.data || error.message);
  }
}

