import React, { useEffect, useState, useRef } from "react";
import "./styles/canvas.css";
import MetaballCollection from "./metaballCollection";

const Canvas = (() => {

    var metaballs = new MetaballCollection(6);

    const canvasRef = useRef(null);
    const requestIdRef = useRef(null);
    const collectionRef = useState(null);
    collectionRef.current = metaballs;

    const size = {width: window.innerWidth, height: window.innerHeight};

    useEffect(() => {

        const ctx = canvasRef.current.getContext("2d");

        const update = (() => {
            collectionRef.current.update(ctx);
        });

        const renderFrame = (() => {
            ctx.fillStyle = "#222222";
            ctx.fillRect(0,0, window.innerWidth, window.innerHeight);
            update();
        });

        const tick = (() => {
            if (!canvasRef.current) return;
            renderFrame();
            requestIdRef.current = requestAnimationFrame(tick);
        });

        requestIdRef.current = requestAnimationFrame(tick);

        const handleResize = e => {
            ctx.canvas.height = window.innerHeight - 40;
            ctx.canvas.width = window.innerWidth - 40;
            metaballs.size = {width: ctx.canvas.width, height: ctx.canvas.height};
            collectionRef.current.update(ctx);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(requestIdRef.current);
            window.removeEventListener("resize", handleResize);
        };
    },[collectionRef]);

    return (<canvas width={size.width - 40} height={size.height - 40} ref={canvasRef}></canvas>)
});

export default Canvas