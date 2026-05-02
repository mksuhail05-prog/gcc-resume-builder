export async function onRequestPost(context) {
  return Response.json({
    ok: true,
    message: "Cloudflare Pages Function is working"
  });
}
