[] = await Promise.all([loadsym("./basic.js")])

$.setup_encode = async (cvs, src) => {
  let ctx = cvs.getContext("2d")
  let draw = frame => {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    ctx.drawImage(frame, 0, 0)
  }

  let di = 0
  let decoder = new VideoDecoder({
    output: frame => {
      log("decoder", di++)
      draw(frame)
      frame.close()
    }, error: console.error
  })

  let encoder = new VideoEncoder({
    output: (chunk, md) => {
      md.decoderConfig ? decoder.configure(md.decoderConfig) : 0
      decoder.decode(chunk)
    }, error: console.error
  })
  encoder.configure({
    // codec: "avc1.42001E",
    codec: "vp09.00.10.08",
    // codec: "vp8",
    width: cvs.width,
    height: cvs.height,
  })
  let reader = src.getReader(), i = 0
  let encode_frame = async () => {
    let frame = (await reader.read()).value
    if (encoder.encodeQueueSize >= 2) await encoder.flush()
    log("encoder", i, "encoder queue", encoder.encodeQueueSize)
    let keyFrame = (i++ % 130) === 0
    encoder.encode(frame, { keyFrame })
    frame.close()
    encode_frame()
  }
  encode_frame()
}