import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function runPythonDb(args: string[], inputData?: any): Promise<{ stdout: string; code: number }> {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", [path.join(__dirname, "db_manager.py"), ...args]);
    let stdout = "";
    let stderr = "";

    if (inputData !== undefined) {
      py.stdin.write(JSON.stringify(inputData));
      py.stdin.end();
    }

    py.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    py.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0 && !stdout) {
        reject(new Error(stderr || `Python process exited with code ${code}`));
      } else {
        resolve({ stdout, code: code ?? 0 });
      }
    });

    py.on("error", (err) => {
      reject(err);
    });
  });
}

async function startServer() {
  // Initialize SQLite database
  try {
    await runPythonDb(["init"]);
    console.log("SQLite database initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize SQLite database:", err);
  }

  const app = express();
  app.use(express.json());

  // CORS middleware for standard development
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // REST API Endpoints
  // GET /api/stats/ - Dashboard statistics
  app.get("/api/stats/", async (req: Request, res: Response) => {
    try {
      const { stdout } = await runPythonDb(["stats"]);
      res.json(JSON.parse(stdout));
    } catch (err: any) {
      console.error("Error in /api/stats/:", err);
      res.status(500).json({ error: "Unable to calculate statistics", details: err.message });
    }
  });

  // GET /api/categories/
  app.get("/api/categories/", (req: Request, res: Response) => {
    res.json([
      "Electronics", "Books", "ID Card", "Wallet", 
      "Keys", "Clothing", "Accessories", "Documents", "Other"
    ]);
  });

  // GET /api/statuses/
  app.get("/api/statuses/", (req: Request, res: Response) => {
    res.json(["Lost", "Found", "Returned"]);
  });

  // GET /api/items/ - Read all items with Search, Filter & Ordering
  app.get("/api/items/", async (req: Request, res: Response) => {
    try {
      const search = (req.query.search as string) || "";
      const status = (req.query.status as string) || "";
      const category = (req.query.category as string) || "";
      const ordering = (req.query.ordering as string) || "-id";

      const { stdout } = await runPythonDb(["list", search, status, category, ordering]);
      const items = JSON.parse(stdout);
      res.json(items);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Unable to retrieve items from database", details: err.message });
    }
  });

  // GET /api/items/:id/ - Read single item
  app.get("/api/items/:id/", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { stdout, code } = await runPythonDb(["get", id]);
      const data = JSON.parse(stdout);
      if (code !== 0 || data.error) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(data);
    } catch (err: any) {
      res.status(404).json({ error: "Item not found", details: err.message });
    }
  });

  // POST /api/items/ - Create item
  app.post("/api/items/", async (req: Request, res: Response) => {
    try {
      const { stdout, code } = await runPythonDb(["create"], req.body);
      const data = JSON.parse(stdout);
      if (code !== 0 || data.error) {
        return res.status(400).json(data);
      }
      res.status(201).json(data);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to create item", details: err.message });
    }
  });

  // PUT /api/items/:id/ - Full update
  app.put("/api/items/:id/", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { stdout, code } = await runPythonDb(["update", id], req.body);
      const data = JSON.parse(stdout);
      if (code !== 0 || data.error) {
        const statusCode = data.error === "Item not found" ? 404 : 400;
        return res.status(statusCode).json(data);
      }
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update item", details: err.message });
    }
  });

  // PATCH /api/items/:id/ - Partial update
  app.patch("/api/items/:id/", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { stdout, code } = await runPythonDb(["update", id, "--partial"], req.body);
      const data = JSON.parse(stdout);
      if (code !== 0 || data.error) {
        const statusCode = data.error === "Item not found" ? 404 : 400;
        return res.status(statusCode).json(data);
      }
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update item", details: err.message });
    }
  });

  // DELETE /api/items/:id/ - Delete item
  app.delete("/api/items/:id/", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { stdout, code } = await runPythonDb(["delete", id]);
      const data = JSON.parse(stdout);
      if (code !== 0 || data.error) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully", id: parseInt(id, 10) });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete item", details: err.message });
    }
  });

  // POST /api/items/:id/mark_returned/ - Custom action: Mark item as Returned
  app.post("/api/items/:id/mark_returned/", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { stdout, code } = await runPythonDb(["mark_returned", id]);
      const data = JSON.parse(stdout);
      if (code !== 0 || data.error) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item marked as returned successfully", item: data });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to mark item as returned", details: err.message });
    }
  });

  // POST /api/reset-sample/ - Reset to sample data
  app.post("/api/reset-sample/", async (req: Request, res: Response) => {
    try {
      const { stdout } = await runPythonDb(["reset"]);
      res.json(JSON.parse(stdout));
    } catch (err: any) {
      res.status(500).json({ error: "Failed to reset sample data", details: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
