type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea" | "json";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type Operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

/**
 * This list of operations is used to generate the manual testing UI.
 */
const operations: Operation[] = [
  {
    name: "Send Message",
    endpoint: "/api/messages",
    method: "POST",
    fields: { to: "input", content: "input" },
  },
  {
    name: "Get Messages",
    endpoint: "/api/messages",
    method: "GET",
    fields: { to: "input" },
  },
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update Password",
    endpoint: "/api/users/password",
    method: "PATCH",
    fields: { currentPassword: "input", newPassword: "input" },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", content: "input", options: { backgroundColor: "input" } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Set Your Location",
    endpoint: "/api/location",
    method: "POST",
    fields: { location: "input" },
  },
  {
    name: "Get your Location",
    endpoint: "/api/location",
    method: "GET",
    fields: {},
  },
  {
    name: "Change Your Location",
    endpoint: "/api/location",
    method: "PATCH",
    fields: { location: "input" },
  },
  {
    name: "Create a Group",
    endpoint: "/api/group/:groupName",
    method: "POST",
    fields: { groupName: "input" },
  },
  {
    name: "Delete a Group",
    endpoint: "/api/group/:groupName",
    method: "DELETE",
    fields: { groupName: "input" },
  },

  {
    name: "See Group Members",
    endpoint: "/api/group/:groupName",
    method: "GET",
    fields: { groupName: "input" },
  },
  {
    name: "See Groups",
    endpoint: "/api/group",
    method: "GET",
    fields: { },
  },
  {
    name: "Invite To Group",
    endpoint: "/api/group/invite/:groupName",
    method: "PUT",
    fields: { groupName: "input" , to: "input"},
  },
  {
    name: "Accept Invite to Group",
    endpoint: "/api/group/join/:groupName",
    method: "PATCH",
    fields: { groupName: "input" },
  },
  {
    name: "Reject Invite to Group",
    endpoint: "/api/group/reject/:groupName",
    method: "PATCH",
    fields: { groupName: "input" },
  },
  {
    name: "Leave Group",
    endpoint: "/api/group/leave/:groupName",
    method: "DELETE",
    fields: { groupName: "input" },
  },
  {
    name: "Get Group Board",
    endpoint: "/api/group/boards/:groupName",
    method: "GET",
    fields: { groupName: "input" },
  },
  {
    name: "Make Group Forum",
    endpoint: "/api/group/boards/:groupName",
    method: "PUT",
    fields: { groupName: "input" },
  },
  {
    name: "Delete Group Forum",
    endpoint: "/api/group/boards/:groupName",
    method: "DELETE",
    fields: { groupName: "input" },
  },
  {
    name: "Get Forums",
    endpoint: "/api/forums",
    method: "GET",
    fields: { },
  },
  {
    name: "Create Forum",
    endpoint: "/api/forums",
    method: "PUT",
    fields: { forumName: "input" },
  },
  {
    name: "Delete Forum",
    endpoint: "/api/forums",
    method: "DELETE",
    fields: { forumName: "input" },
  },
  {
    name: "Join Forum",
    endpoint: "/api/forums/:forumName",
    method: "PUT",
    fields: { forumName: "input" },
  },
  {
    name: "Leave Forum",
    endpoint: "/api/forums/:forumName",
    method: "DELETE",
    fields: { forumName: "input" },
  },
  {
    name: "View Forum",
    endpoint: "/api/forums/:forumName",
    method: "GET",
    fields: { forumName: "input" },
  },
  {
    name: "Post to Forum",
    endpoint: "/api/forums/:forumName",
    method: "POST",
    fields: { forumName: "input" , content: "input"},
  },
  {
    name: "Post to Group Board",
    endpoint: "/api/group/boards/:groupName",
    method: "POST",
    fields: { groupName: "input" , content: "input"},
  },





  //
  // ...
  //
];

/*
 * You should not need to edit below.
 * Please ask if you have questions about what this test code is doing!
 */

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      const htmlTag = tag === "json" ? "textarea" : tag;
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${htmlTag} name="${prefix}${name}"></${htmlTag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const op = operations.find((op) => op.endpoint === $endpoint && op.method === $method);
  const pairs = Object.entries(reqData);
  for (const [key, val] of pairs) {
    if (val === "") {
      delete reqData[key];
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type = key.split(".").reduce((obj, key) => obj[key], op?.fields as any);
    if (type === "json") {
      reqData[key] = JSON.parse(val as string);
    }
  }

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
