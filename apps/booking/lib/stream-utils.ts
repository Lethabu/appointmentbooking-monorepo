export async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        result += decoder.decode(value, { stream: true });
    }
    return result;
}

export async function* streamNdjson<T>(stream: ReadableStream<Uint8Array>): AsyncGenerator<T> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            if (buffer.length > 0) {
                try {
                    yield JSON.parse(buffer);
                } catch (e) {
                    console.error("Error parsing final JSON object:", e);
                }
            }
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line.length > 0) {
                try {
                    yield JSON.parse(line);
                } catch (e) {
                    console.error("Error parsing JSON object from line:", line, e);
                    // Continue to next line
                }
            }
        }
        buffer = lines[lines.length - 1];
    }
}